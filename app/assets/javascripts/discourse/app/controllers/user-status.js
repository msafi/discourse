import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import { action } from "@ember/object";
import { notEmpty } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { popupAjaxError } from "discourse/lib/ajax-error";
import bootbox from "bootbox";
import { emojiUnescape } from "discourse/lib/text";
import discourseComputed from "discourse-common/utils/decorators";

export default Controller.extend(ModalFunctionality, {
  userStatusService: service("user-status"),

  emoji: "mega",
  description: null,
  showDeleteButton: false,
  emojiPickerIsActive: false,
  statusIsSet: notEmpty("description"),

  onShow() {
    const status = this.currentUser.status;
    if (status) {
      this.setProperties({
        emoji: status.emoji || "mega",
        description: status.description,
        showDeleteButton: true,
        emojiPickerIsActive: false,
      });
    } else {
      this._resetModal();
    }
  },

  @discourseComputed("emoji")
  emojiHtml(emoji) {
    return emojiUnescape(`:${emoji}:`);
  },

  @action
  delete() {
    this.userStatusService
      .clear()
      .then(() => this.send("closeModal"))
      .catch((e) => this._handleError(e));
  },

  @action
  saveAndClose() {
    if (this.description) {
      const status = { description: this.description, emoji: this.emoji };
      this.userStatusService
        .set(status)
        .then(() => {
          this.send("closeModal");
        })
        .catch((e) => this._handleError(e));
    }
  },

  @action
  emojiSelected(emoji) {
    this.set("emoji", emoji);
    this.set("emojiPickerIsActive", false);
  },

  @action
  toggleEmojiPicker() {
    if (this.emojiPickerIsActive) {
      this.set("emojiPickerIsActive", false);
    } else {
      this.set("emojiPickerIsActive", true);
    }
  },

  _handleError(e) {
    if (typeof e === "string") {
      bootbox.alert(e);
    } else {
      popupAjaxError(e);
    }
  },

  _resetModal() {
    this.setProperties({
      description: null,
      emoji: "mega",
      showDeleteButton: false,
      emojiPickerIsActive: false,
    });
  },
});
