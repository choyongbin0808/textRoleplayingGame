const $startScreen = document.querySelector('#start_screen');
const $gameMenu = document.querySelector('#game_menu');
const $battleMenu = document.querySelector('#battle_menu');

const $heroName = document.querySelector('#hero_name');
const $heroLevel = document.querySelector('#hero_level');
const $heroHp = document.querySelector('#hero_hp');
const $heroXp = document.querySelector('#hero_xp');
const $heroAtk = document.querySelector('#hero_atk');


const $mosterName = document.querySelector('#monster_name');
const $mosterHp = document.querySelector('#monster_hp');
const $mosterAtk = document.querySelector('#monster_atk');
const $message = document.querySelector('#message');

class Game {
    constructor(name) {
        this.monster = null;
        this.hero = null;
        this.monsterList = [
            {name: '슬라임', hp: 25, atk: 10, xp: 10},
            {name: '스켈레톤', hp:50 , atk: 15, xp: 20},
            {name: '마왕', hp: 150, atk: 35, xp: 50},
        ];
        this.start(name);
    }
    start(name) {
        $gameMenu.addEventListener('submit', this.onGameMenuInput);
        $battleMenu.addEventListener('submit', this.onBattleMenuInput);
        this.changeScreen('game');
        this.hero = new Hero(name);
        this.updateHeroState();
    }
    changeScreen(screen) {
        if (screen === 'start') {
            $startScreen.style.display = 'block';
            $gameMenu.style.display = 'none';
            $battleMenu.style.display = 'none';
        } else if (screen === 'game') {
            $startScreen.style.display = 'none';
            $gameMenu.style.display = 'block';
            $battleMenu.style.display = 'none';
        } else if (screen === 'battle') {
            $startScreen.style.display = 'none';
            $gameMenu.style.display = 'none';
            $battleMenu.style.display = 'block';
        }
    }
    onGameMenuInput = (event) => {
        event.preventDefault();
        const input = event.target['menu_input'].value;
        if (input === '1') {
            this.changeScreen('battle');
        } else if (input === '2') {
            
        } else if (input === '3') {

        }
    }
    onBattleMenuInput = (event) => {
        event.preventDefault();
        const input = event.target['battle_input'].value;
        if (input === '1') {
            
        } else if (input === '2') {
            
        } else if (input === '3') {

        }
    }

    updateHeroState() {
        const {hero} = this;
        if (hero === null) {
            $heroName.textContent = '';
            $heroLevel.textContent = '';
            $heroHp.textContent = '';
            $heroXp.textContent = '';
            $heroAtk.textContent = '';
            return;
        }
        $heroName.textContent = hero.name;
        $heroLevel.textContent = `${hero.lev}Lev.`;
        $heroHp.textContent = `HP : ${hero.hp}/${hero.maxhp}`;
        $heroXp.textContent = `XP : ${hero.xp}/${hero.xp * 15}`;
        $heroAtk.textContent = `ATK : ${hero.atk}`;
    }
}

class Unit {
    constructor(name, hp, atk, xp) {
        this.name = name;
        this.hp = hp;
        this.maxhp = hp;
        this.atk = atk;
        this.xp = xp;
    }
    attak(target) {
        target.hp -= this.atk;
    }
}

class Hero extends Unit{
    constructor(name) {
        super(name, 100, 10, 0);
        this.lev = 1;
    }
    heal(monster) {
        this.hp += 20;
        this.hp -= monster.atk;
    }
}

class Monster extends Unit {

}

let game = null;
$startScreen.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = event.target['user_name'].value;
    game = new Game(name);
})