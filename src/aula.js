/*
--------------- NOTES -------------

status:
0 = IKKE KOMMET
1 = SYG
2 = FERIE/FRI
3 = KOMMET/TIL STEDE
4 = PÅ TUR
5 = SOVER
8 = HENTET/GÅET

entryTime = aflevers kl.
checkInTime = afleveret kl.
exitWith = hentes af
exitTime = hendes kl.
checkOutTime = hentet kl.
checkInTime = afleveret kl.
sleepIntervals [] = sove tider

*/


class Aula extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      this.innerHTML = `
          <ha-card header="Aula">
            <style> @import "/local/aula/aula.css"; </style>
            <div class="card-content" id="auladailyoverview"></div>
          </ha-card>
        `;
      this.content = this.querySelector('div');
    }

    var today = new Date();
    const entityId = this.config.entity;
    const state = hass.states[entityId];
    console.log(state);
    let resp = state.attributes;

    if(state.state === "unavailable") {
      let container =
        `<div>` +
        `No Data available from sensor` +
        `</div>`

      this.content.innerHTML = container;
    } else {
      let name = resp.friendly_name;
      let status = this.GetStatusFromState(state.state);
      let entryTime = this.GetEntryTime(resp.checkInTime, resp.entryTime, status);
      let exitTime = this.GetExitTime(resp.checkOutTime, resp.exitTime, resp.exitWith, status);
      let sleepIntervals = this.GetSleepTimes(resp.sleepIntervals, status);
      
      let statustext = `<strong>Status:</strong> ${this.GetStatusText(status)}<br />`;
      let statusicon = `${this.GetStatusIcon(status)}`;
      let useractivities = `${statustext}${entryTime}${sleepIntervals}${exitTime}</div>`;
      let imgurl = resp.profilePicture;

      if (today.getDay() == 6 || today.getDay() == 0) {
        statusicon = `${this.GetStatusIcon(20)}`;
        let container = `<div>` +
          `<div class="picture-container"><div class="picture"><img src="${imgurl}" alt="${name}"></div>${statusicon}</div>` +
          `<div class="user-activities">Weekend!</div>` +
          `<div class="clearfix"></div>` +
          `</div>`

        this.content.innerHTML = container;
      } else {
        let container =
          `<div>` +
          `<div class="picture-container"><div class="picture">${statusicon}<img src="${imgurl}" alt="${name}"></div></div>` +
          `<div class="user-activities-container"><div class="user-activities">${useractivities}</div></div>` +
          `<div class="clearfix"></div>` +
          `</div>`

        this.content.innerHTML = container;
      }
      this.content.parentElement.setAttribute("header", `${name}`);
    }
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 2;
  }

  GetStatusText(status) {
    switch (status) {
      case 1:
        return "Syg";
      case 2:
        return "Ferie/Fri";
      case 3:
        return "Til stede";
      case 4:
        return "På tur"
      case 5:
        return "Sover";
      case 8:
        return "Gået";
      default:
        return `Ukendt status: ${status}`;
    }
  }

  GetStatusIcon(status) {
    switch (status) {
      case 1:
        return `<div class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M160 64c-26.5 0-48 21.5-48 48V276.5c0 17.3-7.1 31.9-15.3 42.5C86.2 332.6 80 349.5 80 368c0 44.2 35.8 80 80 80s80-35.8 80-80c0-18.5-6.2-35.4-16.7-48.9c-8.2-10.6-15.3-25.2-15.3-42.5V112c0-26.5-21.5-48-48-48zM48 112C48 50.2 98.1 0 160 0s112 50.1 112 112V276.5c0 .1 .1 .3 .2 .6c.2 .6 .8 1.6 1.7 2.8c18.9 24.4 30.1 55 30.1 88.1c0 79.5-64.5 144-144 144S16 447.5 16 368c0-33.2 11.2-63.8 30.1-88.1c.9-1.2 1.5-2.2 1.7-2.8c.1-.3 .2-.5 .2-.6V112zM208 368c0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3V272c0-8.8 7.2-16 16-16s16 7.2 16 16v50.7c18.6 6.6 32 24.4 32 45.3z"/></svg></div>`;
      case 2:
        return `<div class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"/></svg></div>`;
      case 3:
        return `<div class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg></div>`;
      case 4:
        return `<div class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 0C390.4 0 480 35.2 480 80V96l0 32c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32v32c0 17.7-14.3 32-32 32H384c-17.7 0-32-14.3-32-32V448H160v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h0V96h0V80C32 35.2 121.6 0 256 0zM96 160v96c0 17.7 14.3 32 32 32H240V128H128c-17.7 0-32 14.3-32 32zM272 288H384c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H272V288zM112 400c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32zm288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32zM352 80c0-8.8-7.2-16-16-16H176c-8.8 0-16 7.2-16 16s7.2 16 16 16H336c8.8 0 16-7.2 16-16z"/></svg></div>`;
      case 5:
        return `<div class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zM176 288c-44.2 0-80-35.8-80-80s35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80z"/></svg></div>`;
      case 8:
        return `<div class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M543.8 287.6c17 0 32-14 32-32.1c1-9-3-17-11-24L512 185V64c0-17.7-14.3-32-32-32H448c-17.7 0-32 14.3-32 32v36.7L309.5 7c-6-5-14-7-21-7s-15 1-22 8L10 231.5c-7 7-10 15-10 24c0 18 14 32.1 32 32.1h32v69.7c-.1 .9-.1 1.8-.1 2.8V472c0 22.1 17.9 40 40 40h16c1.2 0 2.4-.1 3.6-.2c1.5 .1 3 .2 4.5 .2H160h24c22.1 0 40-17.9 40-40V448 384c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v64 24c0 22.1 17.9 40 40 40h24 32.5c1.4 0 2.8 0 4.2-.1c1.1 .1 2.2 .1 3.3 .1h16c22.1 0 40-17.9 40-40V455.8c.3-2.6 .5-5.3 .5-8.1l-.7-160.2h32z"/></svg></div>`;
      case 20:
        //weekend
        return `<div class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg></div>`;
      default:
        //Unknown status (question mark)
        return `<div class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M96 96c-17.7 0-32 14.3-32 32s-14.3 32-32 32s-32-14.3-32-32C0 75 43 32 96 32h97c70.1 0 127 56.9 127 127c0 52.4-32.2 99.4-81 118.4l-63 24.5 0 18.1c0 17.7-14.3 32-32 32s-32-14.3-32-32V301.9c0-26.4 16.2-50.1 40.8-59.6l63-24.5C240 208.3 256 185 256 159c0-34.8-28.2-63-63-63H96zm48 384c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z"/></svg></div>`;
    }
  }

  GetEntryTime(checkInTime, entryTime, status) {
    if (status === 2 || status === 1) { return "<br />"; }

    if (checkInTime != null) {
      return "<strong>Kom kl.:</strong> " + checkInTime.substring(0, 5) + "<br />";
    } else {
      return "<strong>Ankommer kl.:</strong> " + entryTime.substring(0, 5) + "<br />";
    }
  }

  GetSleepTimes(sleepIntervals, status) {
    if (sleepIntervals === null || sleepIntervals.length === 0) {
      return "";
    }

    let sleepIntervalsResult = "<strong>Sovetider:</strong> ";
    sleepIntervals.forEach((element) => {
      let starttime = element.startTime.substring(0, 5);
      let endtime = "ingen sluttid";
      if (element.endTime != null) {
        endtime = element.endTime.substring(0, 5);
      }

      // console.log(endtime);
      sleepIntervalsResult += ` ${starttime} - ${endtime},`;
    });
    sleepIntervalsResult = sleepIntervalsResult.substring(0, sleepIntervalsResult.length - 1);
    sleepIntervalsResult = sleepIntervalsResult + "<br />";

    switch (status) {
      case 1:
        return "<br />";
      case 2:
        return "<br />";
      case 4:
        return "<br />";
      case 3:
      case 5:
      case 8:
        return sleepIntervalsResult;
      default:
        return `<strong>Ukendt status: ${status}</strong>`;

    }


  }

  GetExitTime(checkOutTime, exitTime, exitWith, status) {
    if (checkOutTime == null) checkOutTime = "";
    
    if (exitWith === null) exitWith = "";
    exitTime = (exitTime === "23:59:00" || exitTime === null) ? "<i>ikke udfyldt</i>" : "kl. " + exitTime.substring(0, 5)
    switch (status) {
      case 1:
      case 2:
        return "<br />";
      case 3:
      case 4:
      case 5:
        return `<strong>Hentes af:</strong> ${exitWith} ${exitTime}<br />`;
      case 8:
        return `<strong>Hentet af:</strong> ${exitWith} kl. ${checkOutTime.substring(0, 5)}<br />`;
      default:
        return `<strong>Ukendt status: ${status}</strong>`;

    }
  }

  GetStatusFromState(state) {
    switch(state) {
      case "Ikke kommet":
        return 0
      case "Syg":
        return 1;
      case "Ferie/Fri":
        return 2;
      case "Kommet/Til stede":
        return 3;
      case "På tur":
        return 4;
      case "Sover":
        return 5;
      case  "Gået":
        return 8;
        default:
          return state;

    }
  }
}

customElements.define('aula-frontend', Aula);
