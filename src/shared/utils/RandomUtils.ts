export class RandomUtils {
    public static delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    public static interval(minNum:number,maxNum: number){
        let result=  this.single(maxNum-minNum)
        return result+minNum
    }

    public static single(maxNum: number){
       return  Math.ceil(Math.random()*maxNum);
    }
  }
  