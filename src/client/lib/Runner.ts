export class Runner {
  protected interval: NodeJS.Timeout | null = null;
  protected cleanup: NodeJS.Timeout | null = null;

  protected modifierCallback: (state: object) => object;

  constructor(protected _state: object, protected timeout: number = 200) {
    this.modifierCallback = (object) => object ;
  }

  start() {
    if (this.cleanup) {
      clearTimeout(this.cleanup);
    }

    this.interval = setInterval(() => {
      this._state = this.modifierCallback(this._state);
    }, this.timeout);

    this.cleanup = setTimeout(() => {
      this.end();
    }, 10000)
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

  set state(state: object) {
    this._state = state;
  }
}
