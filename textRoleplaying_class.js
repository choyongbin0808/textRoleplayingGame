const $startScreen = document.querySelector('#start_screen');
const $gameMenu = document.querySelector('#game_menu');
const $battleMenu = document.querySelector('#battle_menu');

const $heroName = document.querySelector('#hero_name');
const $heroLevel = document.querySelector('#hero_level');
const $heroHp = document.querySelector('#hero_hp');
const $heroXp = document.querySelector('#hero_xp');
const $heroAtk = document.querySelector('#hero_atk');


const $monsterName = document.querySelector('#monster_name');
const $monsterHp = document.querySelector('#monster_hp');
const $monsterAtk = document.querySelector('#monster_atk');
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
            this.hero.adventureCount++; 
            this.changeScreen('battle');
            this.createMonster();
        } else if (input === '2') {
             if (this.hero.adventureCount >= 2) {
                this.hero.hp = Math.min(this.hero.hp + 35, this.hero.maxhp);
                this.updateHeroState();
                this.showMessage('휴식을 취합니다. HP 35가 회복됩니다.');
                this.hero.adventureCount = 0;
            } else {
                this.showMessage('휴식을 하려면 모험을 2번 이상 해야 합니다!');
            }
        } else if (input === '3') {
            this.showMessage('던전에서 나갔습니다.');
            this.hero.adventureCount = 0;
            this.monster = null;
            this.updateMonsterState();
            this.changeScreen('start');
        }
    }
    createMonster() {
        const randomIndex = Math.floor(Math.random() * this.monsterList.length);
        const randomMonster = this.monsterList[randomIndex];
        this.monster = new Monster(
            randomMonster.name,
            randomMonster.hp,
            randomMonster.atk,
            randomMonster.xp,
        );
        this.updateMonsterState();
        this.showMessage(`몬스터와 마주쳤다. ${this.monster.name}인 것 같다!`);
    }
    updateMonsterState() {
        const {monster} = this;
        if (monster === null) {
            $monsterName.textContent = '';
            $monsterHp.textContent = '';
            $monsterAtk.textContent = '';
            return;
        }
        $monsterName.textContent = monster.name;
        $monsterHp.textContent = `HP ${monster.hp}/${monster.maxhp}`;
        $monsterAtk.textContent = `ATK ${monster.atk}`;
    }
    showMessage(text) {
        $message.innerHTML = text;
    }
    onBattleMenuInput = (event) => {
        event.preventDefault();
        const input = event.target['battle_input'].value;
        const {hero, monster} = this;
        if (input === '1') {
            hero.attack(monster);
            monster.attack(hero);
            if (hero.hp <= 0) {
                this.showMessage(`${hero.lev}레벨에서 사망하였습니다....`)
                this.quit();
            } else if (monster.hp <= 0) {
                this.showMessage(`몬스터를 잡아 ${monster.xp}의 경험치를 획득했다.`);
                hero.getXp(monster.xp);
                this.monster = null;
                this.updateHeroState();
                this.updateMonsterState();
                this.changeScreen('game');
            } else {
                this.showMessage(`${hero.atk}의 피해를 주고, ${monster.atk}의 피해를 받았다!`);
                this.updateHeroState();
                this.updateMonsterState();
            }
        } else if (input === '2') {
            hero.heal(monster)
            if (hero.hp <= 0){
                this.showMessage(`${hero.lev}레벨에서 사망하였습니다...`)
                this.quit();
            }
            this.updateHeroState();
            this.showMessage(`HP를 20 회복했고, ${monster.atk}의 피해를 받았습니다.`);
        } else if (input === '3') {
            this.showMessage('몬스터에게 도망을 쳤습니다. <br>경험치 5와 체력 15가 깎입니다.');
            this.hero.getXp(-5);
            this.hero.getHp(-15);
            this.monster = null;
            this.updateHeroState();
            this.updateMonsterState();
            this.changeScreen('game');
        }
    }
    quit() {
        this.hero = null;
        this.monster = null;
        this.updateHeroState();
        this.updateMonsterState();
        $gameMenu.removeEventListener('submit', this.onGameMenuInput);
        $battleMenu.removeEventListener('submit', this.onBattleMenuInput);
        this.changeScreen('start');
        game = null;
    }

    updateHeroState() { // 주인공 정보
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
    attack(target) {
        target.hp -= this.atk;
    }
}

class Hero extends Unit{
    constructor(name) {
        super(name, 100, 10, 0);
        this.lev = 1;
        this.adventureCount = 0;
    }
    heal(monster) {
        const healHp = Math.min(this.hp += 20, this.maxhp);
        this.hp = healHp;
        this.hp -= monster.atk;
    }
    getXp(xp) {
        this.xp += xp;
        if (this.xp < 0) this.xp = 0;
        if (this.xp >= this.lev * 15) {
            this.xp -= this.lev * 15;
            this.lev += 1;
            this.maxhp += 5;
            this.atk += 5;
            this.hp = this.maxhp;
        }
    }
     getHp(hp) {
        this.hp += hp;
        if (this.hp > this.maxhp) this.hp = this.maxhp;
        if (this.hp < 0) this.hp = 0;
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
