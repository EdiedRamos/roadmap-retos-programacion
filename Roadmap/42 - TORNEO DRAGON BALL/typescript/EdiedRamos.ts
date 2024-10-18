// ======================
// = AUTHOR: EdiedRamos =
// ======================

// ===============
// = DEFINITIONS =
// ===============
const CHANCE_TO_MISS = 0.2;
const DAMAGE_REDUCTION_PERCENTAGE = 0.1;

const GENRES = ["male", "female"] as const;
type Genre = (typeof GENRES)[number];

interface Data {
  avatars: Record<Genre, Array<string>>;
  names: Record<Genre, Array<string>>;
}

// ===========
// = CLASSES =
// ===========

const DATA: Data = {
  // YOUR CUSTOM AVATARS GO HERE
  avatars: {
    male: ["👨🏼", "👨", "👨🏻", "👨🏽", "👨🏾", "👨🏿"],
    female: ["👩🏼", "👩", "👩🏻", "👩🏽", "👩🏾", "👩🏿"],
  },
  // YOUR CUSTOM NAMES GO HERE
  names: {
    male: [
      "Goku",
      "Vegeta",
      "Gohan",
      "Krillin",
      "Piccolo",
      "Trunks",
      "Bardock",
      "Raditz",
      "Frieza",
      "Cell",
      "Dabura",
      "Yamcha",
      "Tien",
      "Nappa",
      "Goten",
      "Master Roshi",
    ],
    female: [
      "Bulma",
      "Chi-Chi",
      "Videl",
      "Android 18",
      "Pan",
      "Launch",
      "Kefla",
      "Bulla",
      "Maron",
      "Karin",
      "Fasha",
      "Chaozu",
      "Ribrianne",
      "Mafuba",
      "Bardock's Wife",
      "Nana",
    ],
  },
};

class Helper {
  static randomElement<T>(data: ReadonlyArray<T>): T | null {
    if (data.length === 0) return null;
    const randomPosition = Math.floor(Math.random() * data.length);
    return data[randomPosition];
  }

  static randomBetweenRange(start: number, end: number): number {
    return Math.floor(Math.random() * (end - start + 1)) + start;
  }

  static randomGenre() {
    const randomGenre = Helper.randomElement(GENRES);
    if (randomGenre === null)
      throw new Error("Parece que los géneros no están bien definidos.");
    return randomGenre;
  }

  static async clearConsole(time: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.clear();
        resolve();
      }, time);
    });
  }
}

class TournamentEmoji {
  get attack(): string {
    return "🗡️";
  }
  get speed(): string {
    return "💨";
  }
  get defense(): string {
    return "🛡️";
  }
  health(healthLevel: number): string {
    return healthLevel > 50 ? "❤️" : healthLevel > 25 ? "❤️‍🩹" : "💔";
  }
  avatar(genre: Genre): string {
    const randomAvatar = Helper.randomElement<string>(
      DATA.avatars[genre]
    ) as string;

    return randomAvatar;
  }
}

class Fighter {
  constructor(
    private health: number,
    private avatar: string,
    private name: string,
    private velocity: number,
    private damage: number,
    private protection: number,
    private tournamentEmojiService: TournamentEmoji
  ) {}

  get beautyName() {
    return `${this.avatar}(${this.name})`;
  }

  get beautyHealth() {
    return `${this.tournamentEmojiService.health(this.health)}(${this.health})`;
  }

  get beautyVelocity() {
    return `${this.tournamentEmojiService.speed}(${this.velocity})`;
  }

  get beautyDamage() {
    return `${this.tournamentEmojiService.attack}(${this.damage})`;
  }

  get beautyProtection() {
    return `${this.tournamentEmojiService.defense}(${this.protection})`;
  }

  get toString(): string {
    return `${this.beautyName}🔹${this.beautyHealth}🔹${this.beautyVelocity}🔹${this.beautyDamage}🔹${this.beautyProtection}`;
  }

  get isAlive(): boolean {
    return this.health > 0;
  }

  get getVelocity(): number {
    return this.velocity;
  }

  private decrementHealth(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  attack(opponent: Fighter, narrator?: BattleNarrator): void {
    opponent.defense(this.damage, narrator);
  }

  defense(damage: number, narrator?: BattleNarrator): void {
    const isAttackMissed = Math.random() < CHANCE_TO_MISS;
    if (isAttackMissed) {
      narrator?.dodge(this);
      return;
    }

    if (this.protection > damage) {
      const finalDamage = Math.ceil(damage * DAMAGE_REDUCTION_PERCENTAGE);
      this.decrementHealth(finalDamage);
      return;
    }

    this.decrementHealth(damage);
  }

  set setHealth(health: number) {
    this.health = health;
  }
}

class FighterManager {
  constructor(
    private tournamentEmojiService: TournamentEmoji,
    private narratorService: BattleNarrator
  ) {}

  createFighter(): Fighter {
    const genre = Helper.randomGenre();

    const fighterName = Helper.randomElement(DATA.names[genre]) as string;

    const fighter = new Fighter(
      100,
      this.tournamentEmojiService.avatar(genre),
      fighterName,
      Helper.randomBetweenRange(1, 100),
      Helper.randomBetweenRange(1, 100),
      Helper.randomBetweenRange(1, 100),
      this.tournamentEmojiService
    );
    return fighter;
  }

  async resolveBattle(fighterA: Fighter, fighterB: Fighter): Promise<Fighter> {
    if (!fighterA.isAlive || !fighterB.isAlive)
      throw new Error(
        "¡Ambos luchadores deben estar en pie para comenzar la batalla! Asegúrate de que no haya caído ningún guerrero en el camino."
      );

    await this.narratorService.startBattle(fighterA, fighterB);

    let isTurnFighterA = fighterA.getVelocity > fighterB.getVelocity;
    while (fighterA.isAlive && fighterB.isAlive) {
      this.narratorService.currentStats(fighterA, fighterB);
      if (isTurnFighterA) {
        await this.narratorService.attack(fighterA, fighterB);
        fighterA.attack(fighterB, this.narratorService);
      } else {
        await this.narratorService.attack(fighterB, fighterA);
        fighterB.attack(fighterA, this.narratorService);
      }
      isTurnFighterA = !isTurnFighterA;
    }
    return fighterA.isAlive ? fighterB : fighterA;
  }
}

class BattleNarrator {
  async startBattle(fighterA: Fighter, fighterB: Fighter) {
    console.log(`👴🏻: Tenemos el primero luchador ${fighterA.toString}`);
    console.log(`👴🏻: Y el segundo luchador es ${fighterB.toString}`);
    console.log("*".repeat(50));
    await Helper.clearConsole(4000);
    for (let i = 5; i >= 1; i--) {
      console.log(`La batalla empieza en: ${i}`);
      await Helper.clearConsole(1000);
    }
  }

  async attack(fighterA: Fighter, fighterB: Fighter) {
    console.log("*".repeat(50));
    console.log(`👴🏻: ${fighterA.beautyName} ataca a ${fighterB.beautyName}`);
    console.log("*".repeat(50));
    await Helper.clearConsole(3500);
  }

  dodge(fighter: Fighter) {
    console.log(`👴🏻: ${fighter.beautyName} esquiva el ataque. 😮`);
  }

  currentStats(fighterA: Fighter, fighterB: Fighter) {
    console.log(`⏩ ${fighterA.toString} 🆚 ${fighterB.toString}`);
  }
}

// ========
// = MAIN =
// ========

(async () => {
  const tournamentEmojiService = new TournamentEmoji();
  const narratorService = new BattleNarrator();
  const fighterManager = new FighterManager(
    tournamentEmojiService,
    narratorService
  );

  const fighterA = fighterManager.createFighter();
  const fighterB = fighterManager.createFighter();

  const loser = await fighterManager.resolveBattle(fighterA, fighterB);
  console.log(loser.toString);
})();
