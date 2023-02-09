const cfloat = class {
  
    constructor(re, im) {
      this.re = re;
      this.im = im;
    }
  
    mult(z) {
      let new_re = this.re * z.re - this.im * z.im;
      let new_im = this.re * z.im + this.im * z.re;
      return new cfloat(new_re, new_im);
    }
    
    scale(x) {
      return new cfloat(this.re * x, this.im * x);
    }
  
    div(z) {
      let re_num = this.re * z.re + this.im * z.im;
      let im_num = this.im * z.re - this.re * z.im;
      let denom = z.re * z.re + z.im * z.im;
      return new cfloat(re_num / denom, im_num / denom);
    }
  
    add(z) {
      let new_re = this.re + z.re;
      let new_im = this.im + z.im;
      return new cfloat(new_re, new_im);
    }
  
    sub(z) {
      let new_re = this.re - z.re;
      let new_im = this.im - z.im;
      return new cfloat(new_re, new_im);
    }
  
    magSq() {
      return this.re * this.re + this.im * this.im;
    }
  
    distSq(z) {
      let dre = this.re - z.re;
      let dim = this.im - z.im;
      return dre * dre + dim * dim;
    }
  
    copy() {
      return new cfloat(this.re, this.im);
    }
  
    pow(n) {
      var z = this.copy();
      var m = n;
      if (n > 1) {
        while (m > 1) {
          z = this.mult(z);
          m--;
        }
      } else if (n < 1) {
        while (m < 1) {
          z = this.div(z);
          m++;
        }
      }
      return z;
    }
  }
