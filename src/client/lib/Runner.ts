export class Runner {
  protected interval: NodeJS.Timeout | null;

  protected modifierCallback: (state: object) => object;

  constructor(protected _state: object, protected timeout: number = 200) {
    this.interval = null;
    this.modifierCallback = (object) => object ;
  }

  start() {
    this.interval = setInterval(() => {
      this._state = this.modifierCallback(this._state);
    }, this.timeout);
  }

  end() {
    if (this.interval){
      clearInterval(this.interval);
    }
  }

  modifier(modifier: (state: any) => object) {
    this.modifierCallback = modifier;
  }

  get state(): object {
    return this._state;
  }
}
