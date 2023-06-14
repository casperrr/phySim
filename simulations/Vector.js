// Custom Vector class used for vector maths in simulations.
class Vector{

    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    //vector addition
    add(vec){
        this.x += vec.x;
        this.y += vec.y;
    }

    //vector subtraction
    sub(vec){
        this.x -= vec.x;
        this.y -= vec.y;
    }
    
    //scalar vector multipication
    mult(scl){
        this.x *= scl;
        this.y *= scl;
    }

    //scalar vector division
    div(scl){
        this.x /= scl;
        this.y /= scl;
    }

    //generate a random normalised vector
    random(){
        this.x = Math.random();
        this.y = Math.random();
        this.normalise();
    }

    //return magnitude of vector
    getMag(){
        return Math.sqrt(Math.pow(this.x,2)+ Math.pow(this.y,2))
    }

    //normalise vector (set mag to 1)
    normalise(){
        let mag = this.getMag();
        this.div(mag);
    }

    //Set magnitude of a vector
    setMag(mag){
        this.normalise();
        this.mult(mag);
    }

    //set max magnitude
    limit(mag){
        if(this.getMag > mag){
            this.setMag(mag);
        }
    }

    //copy another vectors values
    copy(vec){
        this.x = vec.x;
        this.y = vec.y;
    }
}