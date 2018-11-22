from math import *

################### BDT ###############################

class BDT :
	
	def __init__(self,sig_pts,bkg_pts) :
		
		self.sig_pts = sig_pts
		self.bkg_pts = bkg_pts

	def train(self) :
		
		mylines = []
		self.tree = []
		self.alphas = []
		
		self.totp = len(self.sig_pts) + len(self.bkg_pts)
		self.sig_w = [1./self.totp]*len(self.sig_pts)
		self.bkg_w = [1./self.totp]*len(self.bkg_pts)

		absMinE = 1e6
		level = 0
		while absMinE > 0.01 :
		
			if level == 10 : break
			print "Level", level

			
			self.alphas.append(1)
			cuts = []
			
			if(level == 0) :
				
				nextcut = self.find_next_cut()
				nextcut["mother"] = None
				cuts.append( nextcut )
			
			else :
				
				if len(self.tree[-1]) == 0 : break
				
				# Loop over last level in tree
				# print "Previous", self.tree[-1]
				for k,c in enumerate(self.tree[-1]) :
				
					# If it it 50% sig e bkg do not expand
					c["sons"] = {}
					if 'X' in c["dec"] : continue
				
					#Expand cut
					for s,dec in enumerate(c["dec"]) :
						if dec in ['S','B'] : continue # If it's 100% sig or bkg do not expand
						
						nextcut = self.find_next_cut(c,s)
						nextcut["mother"] = [level-1,k,s]
						cuts.append( nextcut )
						c["sons"][s] = len(cuts)-1
					
			self.tree.append( cuts )

			print
			print 
			print self.tree[-1]
			print 
			print

			self.calc_error()
			
			if self.err < absMinE :
				absMinE = self.err
						
			if self.err == 0. : 
				print "Error went down to zero. All training points are categorized."
				print "If you're not happy with your training get more training points!"
				break
			
			print "ERROR: ", self.err
			self.alphas[level] = self.calc_alpha()
			self.calc_weights()
			
			level += 1	
		
		cuts_list = ""
		print "\n\nClassifier formula:\nT = ",
		for i,c in enumerate(self.tree) :
			if(len(c)>0) :
				cuts_list += "C%i && " % i
				print '{:4.3} * ('.format(float(self.alphas[i])) + cuts_list[:-3] + ")",
				if i != len(self.tree) - 1 : print " + "
		print 
		print "With:"
		for i,level in enumerate(self.tree) :
			if len(level) == 0 : break
			print "C%i = " % i,
			for j,c in enumerate(level) :
				
				if 'X' not in c["dec"] :
					if c["dec"][0] in ['S','s'] :
						print '[', c["var"], '] < {:4.3} '.format(c["thr"]),
					else :
						print '[', c["var"], '] > {:4.3} '.format(c["thr"]),
				if(j != len(level)-1) : print " || ",
			print
		print
		
		abs_error = 0
		w_error = 0
		BDTout_bkg = 0
		BDTout_sig = 0
		for p,w in zip(self.bkg_pts,self.bkg_w) :
			BDTout_bkg+=self.BDTout(p)
		for p,w in zip(self.sig_pts,self.sig_w) :
			BDTout_sig+=self.BDTout(p)
		
		print "Avg BTDout bkg: ", BDTout_bkg/len(self.bkg_pts)
		print "Avg BTDout sig: ", BDTout_sig/len(self.sig_pts)

	def draw_boundary(self, lines = []) :
	
		scan_pts = []
		for x in drange(0.,1.,0.01) :
			row = []
			for y in drange(0.,1.,0.01) :
				row.append( [ x,y,self.BDTout((x,y), True) ] )
			scan_pts.append(row)
		
		boundary_pts = []
		for x in range(0,len(scan_pts)) :
			cat = scan_pts[x][0][2]
			for y in range(1,len(scan_pts)) :
				newcat = scan_pts[x][y][2]
				if newcat != cat : 
					boundary_pts.append( (scan_pts[x][y][0], (scan_pts[x][y-1][1] + scan_pts[x][y][1])/2.) )
				cat = newcat

		for y in range(0,len(scan_pts)) :
			cat = scan_pts[0][y][2]
			for x in range(1,len(scan_pts)) :
				newcat = scan_pts[x][y][2]
				if newcat != cat : 
					boundary_pts.append( ( (scan_pts[x-1][y][0] + scan_pts[x][y][0])/2., scan_pts[x][y][1] ) )
				cat = newcat
		
		return boundary_pts
				

	def find_threshold(self, dim, c = None, s = None) :
		
		##### Apply previous cuts
		best_thr = 0.
		minD = 1e6

		sig_cut = [ (p,self.sig_w[i]) for i,p in enumerate(self.sig_pts) if self.applyPrevCuts(p,c,s) ]
		bkg_cut = [ (p,self.bkg_w[i]) for i,p in enumerate(self.bkg_pts) if self.applyPrevCuts(p,c,s) ]
		ptscut = []
		ptscut.extend(bkg_cut)
		ptscut.extend(sig_cut)
		
		##### Find best threshold and its disorder
		var = sorted(pp[0][dim] for pp in ptscut)
		best_n_sig_low = best_n_sig_high = best_n_bkg_low = best_n_bkg_high = 0
		
		for j in range(0,len(var)) :
			if j == len(var)-1 or var[j]==var[j+1] :
				continue
			
			thr = (var[j]+var[j+1])/2.
	
			n_sig_low  = sum( [w for i,w in sig_cut if ( i[dim] < thr ) ] )
			n_bkg_low  = sum( [w for i,w in bkg_cut if ( i[dim] < thr ) ] )
			n_sig_high = sum( [w for i,w in sig_cut if ( i[dim] > thr ) ] )
			n_bkg_high = sum( [w for i,w in bkg_cut if ( i[dim] > thr ) ] )
	
			n_low = float(n_sig_low + n_bkg_low)
			n_high = float(n_sig_high + n_bkg_high)
			T = n_high + n_low
			
			D=0.
			if n_sig_low != 0 and n_bkg_low != 0 :
				D += - (n_low/T)*(  (n_sig_low / n_low)*log(n_sig_low / n_low) + (n_bkg_low / n_low)*log(n_bkg_low / n_low) )
			if n_sig_high != 0 and n_bkg_high != 0 :
				D += - (n_high/T)*( (n_sig_high / n_high)*log(n_sig_high / n_high) + (n_bkg_high / n_high)*log(n_bkg_high / n_high) )
			
			if D < minD:
				minD = D
				best_thr = thr
				best_n_sig_low  = n_sig_low
				best_n_sig_high = n_sig_high
				best_n_bkg_low  = n_bkg_low
				best_n_bkg_high = n_bkg_high
		
		###### Decide which side is signal
		
		decision = [
			self.define_category(best_n_sig_low,best_n_bkg_low),
			self.define_category(best_n_sig_high,best_n_bkg_high) ]
		
		return { "thr" : best_thr, "var" : dim, "dec" : decision }, minD
		
	def define_category(self,n_sig,n_bkg) :
	
		if n_sig == 0 :    		# pure background 
			return 'B'	   
		elif n_bkg == 0 :  		# pure signal
			return 'S'
		elif(n_sig == n_bkg) :  # same amount of signal and bkg
			return 'X';
		elif n_sig > n_bkg :
			return 's'
		else :
			return 'b'

	def calc_error(self) :
	
		self.err = 0
		for p,w in zip(self.bkg_pts,self.bkg_w) :
			ans = self.feed_forward(p)
			if ans[-1] in ['S','s','X'] :
				self.err += w
		for p,w in zip(self.sig_pts,self.sig_w) :
			ans = self.feed_forward(p)
			if ans[-1] in ['B','b','X'] :
				self.err += w		
		
		return self.err
	
	def calc_alpha(self) :
	
		return 0.5*log((1-self.err) / self.err)
	
	def calc_weights(self) :
	
		for i,p in enumerate(self.bkg_pts) :
			if self.feed_forward(p)[-1] in ['S','s','X'] :
				self.bkg_w[i] *= sqrt((1-self.err)/self.err)
		for i,p in enumerate(self.sig_pts) :
			#print "Sig ", p, self.feed_forward(p)[-1], self.feed_forward(p)
			if self.feed_forward(p)[-1] in ['B','b','X'] :
				self.sig_w[i] *= sqrt((1-self.err)/self.err)

		sum_w = sum(self.sig_w) + sum(self.bkg_w)
		self.bkg_w = [w/sum_w for w in self.bkg_w]
		self.sig_w = [w/sum_w for w in self.sig_w]

	def BDTout(self,p,binary=False) :
		
		if len(self.tree) == 0 :
			print "You have to train a bit the BDT first!"
			return True
		
		ans = self.feed_forward(p)
		
		res = 0
		for l,a in enumerate(ans) :
			if a in ['S','s'] : 
				res += self.alphas[l]
			elif a in ['B','b'] :
				res += -self.alphas[l]
		
		if binary :
			return sign(res)
		else :
			return res
	
	def feed_forward(self,p,l = None) :
	
		if l is None :
			l = len(self.tree)
		
		ans = []
		cut = self.tree[0][0]
		curlevel = 0
		while(curlevel < len(self.tree)) :
			
			side = int(p[cut["var"]] > cut["thr"])
			ans.append(cut["dec"][side])
			
			if ans[-1] in ['B','S','X'] : break
			
			if not cut.has_key("sons") : break;
			newcut = cut["sons"][side]
			cut = self.tree[curlevel+1][newcut]
			
			curlevel += 1
		
		return ans
		
	def applyPrevCuts(self, p, cut, side) :
	
		if len(self.tree) == 0:
			return True;
		if cut is None :
			return True
	
		curcut = cut
		curside = side
		while curcut is not None :
			
			test = 0
			if curside == 0 :
				test = int(p[curcut["var"]] < curcut["thr"])
			else :
				test = int(p[curcut["var"]] > curcut["thr"]) 
			
			if test == 0 : return False;
			
			mum = curcut["mother"]
			if mum is None : 
				curcut = None		# End of tree
			else :
				curcut = self.tree[mum[0]][mum[1]]
				curside = mum[2]
		
		return True

	def find_next_cut(self, cut = None, side = None) :
		
		minD = 1e6
		best_cut  = {}
		for dim in range(0,len(self.bkg_pts[0])) :
			curcut, disorder = self.find_threshold(dim, cut, side)
			
			if disorder < minD :
				minD = disorder
				best_cut = curcut
		
		return best_cut