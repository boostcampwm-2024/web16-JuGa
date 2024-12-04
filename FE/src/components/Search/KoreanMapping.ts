type CharacterMap = {
  [key: string]: string;
};

export class SimpleKoreanConverter {
  private charMap: CharacterMap;

  constructor() {
    this.charMap = {
      r: 'ㄱ',
      R: 'ㄲ',
      s: 'ㄴ',
      e: 'ㄷ',
      E: 'ㄸ',
      f: 'ㄹ',
      a: 'ㅁ',
      q: 'ㅂ',
      Q: 'ㅃ',
      t: 'ㅅ',
      T: 'ㅆ',
      d: 'ㅇ',
      w: 'ㅈ',
      W: 'ㅉ',
      c: 'ㅊ',
      z: 'ㅋ',
      x: 'ㅌ',
      v: 'ㅍ',
      g: 'ㅎ',

      k: 'ㅏ',
      o: 'ㅐ',
      i: 'ㅑ',
      O: 'ㅒ',
      j: 'ㅓ',
      p: 'ㅔ',
      u: 'ㅕ',
      P: 'ㅖ',
      h: 'ㅗ',
      y: 'ㅛ',
      n: 'ㅜ',
      b: 'ㅠ',
      m: 'ㅡ',
      l: 'ㅣ',
    };
  }

  public convert(input: string): string[] {
    return Array.from(input).map((char) => this.charMap[char] || char);
  }
}
