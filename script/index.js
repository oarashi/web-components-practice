window.onload = function() {
  class CollapseExpand extends HTMLElement {
    constructor() {
      super();

      this.buttonText = {
        "when-close": "Expand",
        "when-open": "Collapse"
      };

      this.events = {
        close: new CustomEvent("collapse-expand.changed", {
          bubbles: true,
          detail: {
            opened: false,
            customText: "some additional text"
          }
        }),
        open: new CustomEvent("collapse-expand.changed", {
          bubbles: true,
          detail: { opened: true, customText: "some additional text" }
        })
      };

      const elementTemplate =

      this.innerHTML = `
      <button type="button">${this.buttonText["when-close"]}</button>
      <div style="display: block; margin: 10px;">
        <div class='content' style="display: none;">${this.innerHTML}</div>
      </div>
    `;

      this.querySelector("button").addEventListener("click", () => {
        this.opened = !this.opened;
      });
    }

    get opened() {
      return this.getAttribute("opened") !== null;
    }

    set opened(state) {
      if (!!state) {
        this.setAttribute("opened", "");
      } else {
        this.removeAttribute("opened");
      }
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      switch (attrName) {
        case "opened":
          const opened = newVal !== null;
          const button = this.querySelector("button");
          const content = this.querySelector(".content");
          const display = opened ? "block" : "none";
          const text = this.buttonText[opened ? "when-open" : "when-close"];
          content.style.display = display;
          button.textContent = text;
          this.dispatchEvent(this.events[opened ? "open" : "close"]);
          break;

        case "text-when-open":
          this.buttonText["when-open"] = newVal;
          if (this.opened) {
            this.querySelector("button").textContent = newVal;
          }
          break;

        case "text-when-close":
          this.buttonText["when-close"] = newVal;
          if (!this.opened) {
            this.querySelector("button").textContent = newVal;
          }
          break;
      }
    }

    static get observedAttributes() {
      return ["opened", "text-when-open", "text-when-close"];
    }
  }

  customElements.define("collapse-expand", CollapseExpand);
};
