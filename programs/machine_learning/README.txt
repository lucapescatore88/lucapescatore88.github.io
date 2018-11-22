README

The application implements two multivariate analysis techniques a Boosted Decision
Tree and a Neural Network. 

DATA :
The script automatically loads some data. You can give it your data in form
of two files: data/sig_pts.txt and data/bkg_pts.txt. The first listing
signal points and the second background points. Each line in the files is a point.
On each line you can specify a list of space separated numbers each one representing
an input variable. A arbitrary number of variables can be used but all lines
must contain the same amount of numbers and they have to be introduced always
in the same order. The first two variables will be the ones plotted by the app.

USAGE :

-- Save and load: "Save" saves the data currently on the plot to the sig_pts.txt
and bkg_pts.txt files. And "Load" loads the current files. "Reset" clears the
board (it does not clear the files if you don't save). 

-- Define a point: using "Get Sig. point" and "Get Bkg. point" you can define by hand
new signal and background points. Signal will be red and background blue.

-- Run the MVA: By clicking on "BDT" and "NeuralNet" you will train the two MVAs
on the points currently on the board. N.B.: NeuralNet is under development and
it will most likely break! So use BDT only for now!
After the training is done it will show the best edge between signal and background.

-- Identify new points: After a MVA is trained you can identify use it to identify
new points. Click on "ID new pt (BDT)". Now you can click on the board.
The point will automatically turn red if the point is in the signal region and
blue if in the background one.

Have fun!
