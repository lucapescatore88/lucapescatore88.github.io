

//// Functions to move objects wrt of each other


function translate_object(vertices,vector) {

    var translated_vertices = [];
    
    for(var i = 0; i< vertices.length; i+=3)
    {
        translated_vertices.push(vertices[i]+vector[0]);
        translated_vertices.push(vertices[i+1]+vector[1]);
        translated_vertices.push(vertices[i+2]+vector[2]);
    }
    
    return translated_vertices;
}

function mult_matrices(mat,vec) {

    var result = [];
    for (var i = 0; i < 3; i++) {
            var sum = 0;
            for (var k = 0; k < 3; k++) {
                sum += mat[i][k] * vec[k];
            }
            result.push(sum);
        }
    return result;
}

function rotate_object(vertices,deg,axis) {

    var rotated_vertices = [];
    
    for(var i = 0; i< vertices.length; i+=3)
    {
        var curvec = [vertices[i],vertices[i+1],vertices[i+2]];        
        var rot_matrix = mat4.create();
        mat4.identity(rot_matrix);
        mat4.rotate(rot_matrix, degToRad(deg), axis);
        
        var mymatrix = [
            [rot_matrix[0],rot_matrix[1],rot_matrix[2]],
            [rot_matrix[4],rot_matrix[5],rot_matrix[6]],
            [rot_matrix[8],rot_matrix[9],rot_matrix[10]]
        ];
        curvec = mult_matrices(mymatrix,curvec);

        rotated_vertices.push(curvec[0]);
        rotated_vertices.push(curvec[1]);
        rotated_vertices.push(curvec[2]);
    }
    
    return rotated_vertices;
}





///// Main class

function Shape(type, len, latitudeBands, longitudeBands){
    
        if (len === undefined) { len = 1.0; }

        this.type = type;
        this.colors = [];
        this.texture = null;
        this.text_id = null;
        
        if(type=="Cube")
        {
            this.vertices = [
            // Front face
            -len/2., -len/2.,  len/2.,
             len/2., -len/2.,  len/2.,
             len/2.,  len/2.,  len/2.,
            -len/2.,  len/2.,  len/2.,

            // Back face
            -len/2., -len/2., -len/2.,
            -len/2.,  len/2., -len/2.,
             len/2.,  len/2., -len/2.,
             len/2., -len/2., -len/2.,

            // Top face
            -len/2.,  len/2., -len/2.,
            -len/2.,  len/2.,  len/2.,
             len/2.,  len/2.,  len/2.,
             len/2.,  len/2., -len/2.,

            // Bottom face
            -len/2., -len/2., -len/2.,
             len/2., -len/2., -len/2.,
             len/2., -len/2.,  len/2.,
            -len/2., -len/2.,  len/2.,

            // Right face
             len/2., -len/2., -len/2.,
             len/2.,  len/2., -len/2.,
             len/2.,  len/2.,  len/2.,
             len/2., -len/2.,  len/2.,

            // Left face
            -len/2., -len/2., -len/2.,
            -len/2., -len/2.,  len/2.,
            -len/2.,  len/2.,  len/2.,
            -len/2.,  len/2., -len/2.
            ];
        
            this.indices = [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
            ];
        
            this.normals = [
            // Front face
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,    

            // Back face
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top face
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom face
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right face
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left face
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            ];
        
        
            this.textCoords = [
            // Front face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            
            // Back face
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            // Top face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,

            // Bottom face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,

            // Right face
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            // Left face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0
            ];
        }
    
    
    if(type=="Pyramid")
    {
        this.vertices = [
        // Front face
         0.0,     len/2.,  0.0,
        -len/2., -len/2.,  len/2.,
         len/2., -len/2.,  len/2.,
        // Right face
         0.0,     len/2.,  0.0,
         len/2., -len/2.,  len/2.,
         len/2., -len/2., -len/2.,
        // Back face
         0.0,     len/2.,  0.0,
         len/2., -len/2., -len/2.,
        -len/2., -len/2., -len/2.,
        // Left face
         0.0,     len/2.,  0.0,
        -len/2., -len/2., -len/2.,
        -len/2., -len/2.,  len/2.
        ];
    
        this.normals = [
        // Front face
        0.0,0.4472135901451111,0.8944271802902222,
        0.0,0.4472135901451111,0.8944271802902222,
        0.0,0.4472135901451111,0.8944271802902222,

        // Right face
        0.8944271802902222,0.4472135901451111,0.0,
        0.8944271802902222,0.4472135901451111,0.0,
        0.8944271802902222,0.4472135901451111,0.0,

        // Back face
        0.0,0.4472135901451111,-0.8944271802902222,
        0.0,0.4472135901451111,-0.8944271802902222,
        0.0,0.4472135901451111,-0.8944271802902222,

        // Left face
        -0.8944271802902222,0.4472135901451111,0.0,
        -0.8944271802902222,0.4472135901451111,0.0,
        -0.8944271802902222,0.4472135901451111,0.0,

        // Bottom face - non-triangle strip
        0.0,-1.0,0.0,
        0.0,-1.0,0.0,
        0.0,-1.0,0.0,
        0.0,-1.0,0.0,
        0.0,-1.0,0.0,
        0.0,-1.0,0.0
        ];
    }



    if(type=="Sphere")
    {
        var radius = len;
        if (latitudeBands === undefined) { latitudeBands = 50; }
        if (longitudeBands === undefined) { longitudeBands = 50; }
    
        this.vertices = [];
        this.normals = [];
        this.textCoords = [];
        for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1 - (longNumber / longitudeBands);
                var v = 1 - (latNumber / latitudeBands);

                this.normals.push(x);
                this.normals.push(y);
                this.normals.push(z);
                this.textCoords.push(u);
                this.textCoords.push(v);
                this.vertices.push(radius * x);
                this.vertices.push(radius * y);
                this.vertices.push(radius * z);
            }
        }
    
        this.indices = [];
        for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
                var first = (latNumber * (longitudeBands + 1)) + longNumber;
                var second = first + longitudeBands + 1;
                this.indices.push(first);
                this.indices.push(second);
                this.indices.push(first + 1);   

                this.indices.push(second);
                this.indices.push(second + 1);
                this.indices.push(first + 1);
            }
        }
    }
    
    if(type=="Rectangle")
    {
        this.vertices = [
            -len/2., -len/2.,  1.0,
             len/2., -len/2.,  1.0,
             len/2.,  len/2.,  1.0,
            -len/2.,  len/2.,  1.0
            ];
        
        this.textCoords = [
          0.0,  0.0,
          1.0,  0.0,
          0.0,  1.0,
          0.0,  1.0,
          1.0,  0.0,
          1.0,  1.0 ];
          
        this.indices = [
            0, 1, 2,      0, 2, 3
            ];// Front face
            
        this.normals = [
            // Front face
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0
            ];
    }
    
    
    this.set_color([1.0,1.0,1.0,1.0]);
};

Shape.prototype.set_color = function(color) {

    if(color.length!=4)
    {
        alert("Wrong color, must have 4 components");
        return;
    }
    this.colors = [];
    for(var k = 0; k < this.vertices.length / 3; k++)
    {
        this.colors = this.colors.concat(color);
    }
    return this.colors;
};

Shape.prototype.init = function (gl,text_file,text_id)
{
    if(text_file===undefined) { text_file = null; }
    if(text_id===undefined) { text_id = gl.TEXTURE0; }
    if(text_file!=null)
    {
        var texture = gl.createTexture();
        texture.image = new Image();
        texture.image.onload = function () {
            handleLoadedTexture(texture);
        }

        texture.image.src = text_file;
        this.texture = texture;
        this.text_id = text_id;
    }
    
    this.moved_vertices = this.vertices;

    this.vertexPositionBuffer = gl.createBuffer();
    this.vertexTextureCoordBuffer = gl.createBuffer();
    this.vertexIndexBuffer = gl.createBuffer();
    this.vertexNormalBuffer = gl.createBuffer();
    this.vertexColorBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = this.vertices.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textCoords), gl.STATIC_DRAW); 
    this.vertexTextureCoordBuffer.itemSize = 2;
    this.vertexTextureCoordBuffer.numItems = this.textCoords.length / 2;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = this.indices.length;
        
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = this.normals.length / 3;
        
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = this.colors.length / 4;
}



Shape.prototype.draw = function(gl)
{
    this.bind_buffers(gl);
    setMatrixUniforms();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

Shape.prototype.set_texture_id = function(id) {
    this.text_id = id;
}

Shape.prototype.use_texture = function(mytexture) {
    this.texture = mytexture;
}

Shape.prototype.bind_buffers = function(gl)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.vertexAttribPointer(curShaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.vertexAttribPointer(curShaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(curShaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(curShaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    if(this.texture!=null) 
    {
        //gl.activeTexture(this.text_id);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(curShaderProgram.samplerUniform, 0);
    }
};

Shape.prototype.translate = function(vector) {
    this.moved_vertices = translate_object(this.moved_vertices,vector);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.moved_vertices), gl.STATIC_DRAW)
};

Shape.prototype.rotate = function(angle,axis) {
    this.moved_vertices = rotate_object(this.moved_vertices,angle,axis);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.moved_vertices), gl.STATIC_DRAW);
};

Shape.prototype.reset_movement = function() {
    this.moved_vertices = this.vertices;
}
