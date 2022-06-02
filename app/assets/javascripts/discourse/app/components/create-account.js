import Component from "@ember/component";
import cookie from "discourse/lib/cookie";

export default Component.extend({
  classNames: ["create-account-body"],

  userInputFocus(event) {
    let label = event.target.parentElement.previousElementSibling;
    if (!label.classList.contains("value-entered")) {
      label.classList.toggle("value-entered");
    }
  },

  userInputFocusOut(event) {
    let label = event.target.parentElement.previousElementSibling;
    if (
      event.target.value.length === 0 &&
      label.classList.contains("value-entered")
    ) {
      label.classList.toggle("value-entered");
    }
  },

  didInsertElement() {
    this._super(...arguments);

    if (cookie("email")) {
      this.set("email", cookie("email"));
    }

    let userTextFields = document.getElementsByClassName("user-fields")[0];

    if (userTextFields) {
      userTextFields = userTextFields.getElementsByClassName(
        "ember-text-field"
      );
    }

    if (userTextFields) {
      for (let element of userTextFields) {
        element.addEventListener("focus", this.userInputFocus);
        element.addEventListener("focusout", this.userInputFocusOut);
      }
    }

    this.element.addEventListener("keydown", (e) => {
      if (!this.disabled && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        this.action();
        return false;
      }
    });

    this.element.addEventListener("click", (event) => {
      const target = document.getElementById(event.target.getAttribute("for"));
      if (target.classList.contains("select-kit")) {
        event.preventDefault();
        target.querySelector(".select-kit-header").click();
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    this.element.removeEventListener("keydown");
    this.element.removeEventListener("click");

    let userTextFields = document.getElementsByClassName("user-fields")[0];

    if (userTextFields) {
      userTextFields = userTextFields.getElementsByClassName(
        "ember-text-field"
      );
    }

    if (userTextFields) {
      for (let element of userTextFields) {
        element.removeEventListener("focus", this.userInputFocus);
        element.removeEventListener("focusout", this.userInputFocusOut);
      }
    }
  },
});
