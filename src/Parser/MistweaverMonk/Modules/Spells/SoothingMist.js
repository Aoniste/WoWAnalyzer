import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

import Combatants from 'Parser/Core/Modules/Combatants';

import Module from 'Parser/Core/Module';

const debug = false;

class SoothingMist extends Module {
  static dependencies = {
    combatants: Combatants,
  };

  soomTicks = 0;

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;

    if(spellId === SPELLS.SOOTHING_MIST.id) {
      this.soomTicks++;
    }
  }

  on_finished() {
    if(debug) {
      console.log('SooM Ticks: ' + this.soomTicks);
      console.log('SooM Perc Uptime: ', (this.soomTicks * 2 / this.owner.fightDuration * 1000));
      console.log('SooM Buff Update: ', this.combatants.selected.getBuffUptime(SPELLS.SOOTHING_MIST.id), ' Percent: ', this.combatants.selected.getBuffUptime(SPELLS.SOOTHING_MIST.id) / this.owner.fightDuration);
    }
  }

  suggestions(when) {
    const soomTicksPerDuration = (this.soomTicks * 2 / this.owner.fightDuration * 1000) || 0;
    when(soomTicksPerDuration).isGreaterThan(.75)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>You are allowing <SpellLink id={SPELLS.SOOTHING_MIST.id} /> to channel for an extended period of time. <SpellLink id={SPELLS.SOOTHING_MIST.id} /> does little healing, so your time is better spent DPS'ing throug the use of <SpellLink id={SPELLS.TIGER_PALM.id} /> and <SpellLink id={SPELLS.BLACKOUT_KICK.id} />.</span>)
          .icon(SPELLS.SOOTHING_MIST.icon)
          .actual(`${soomTicksPerDuration.toFixed(2)} ticks per second`)
          .recommended(`<${recommended} ticks per second is recommended`)
          .regular(recommended + .25).major(recommended + .75);
      });
  }
}

export default SoothingMist;
