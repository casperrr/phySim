// Custom Vector class used for vector maths in simulations.

class Vector{

    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    add(vec){
        this.x += vec.x;
        this.y += vec.y;
    }

    sub(vec){
        this.x -= vec.x;
        this.y -= vec.y;
    }

    mult(scl){
        this.x *= scl;
        this.y *= scl;
    }

    div(scl){
        this.x /= scl;
        this.y /= scl;
    }

    random(){
        this.x = Math.random();
        this.y = Math.random();
        this.normalise();
    }


    getMag(){
        return Math.sqrt(Math.pow(this.x,2)+ Math.pow(this.y,2))
    }

    normalise(){
        let mag = this.getMag();
        this.div(mag);
    }

    setMag(mag){
        this.normalise();
        this.mult(mag);
    }

    limit(mag){
        if(this.getMag > mag){
            this.setMag(mag);
        }
    }

    copy(vec){
        this.x = vec.x;
        this.y = vec.y;
    }
}