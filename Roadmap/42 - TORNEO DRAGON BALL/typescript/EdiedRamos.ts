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

  private decrementHealth(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  attack(opponent: Fighter): void {
    opponent.defense(this.damage);
  }

  defense(damage: number): void {
    const isAttackMissed = Math.random() < CHANCE_TO_MISS;
    if (isAttackMissed) return;

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

  get toString(): string {
    return `${this.beautyName}🔹${this.beautyHealth}🔹${this.beautyVelocity}🔹${this.beautyDamage}🔹${this.beautyProtection}`;
  }
}

class FighterManager {
  constructor(private tournamentEmojiService: TournamentEmoji) {}

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
}

// ========
// = MAIN =
// ========

(() => {
  const tournamentEmojiService = new TournamentEmoji();
  const fighterManager = new FighterManager(tournamentEmojiService);

  const fighterA = fighterManager.createFighter();
  const fighterB = fighterManager.createFighter();

  console.log(fighterA.toString);
  console.log(fighterB.toString);

  fighterA.attack(fighterB);

  console.log(fighterA.toString);
  console.log(fighterB.toString);
})();
