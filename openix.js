Openix.elements = [];

// kiểm tra xem có lấy được phần tử form không?
// console.log($("#modal-2").content.querySelector("#login-form"));

function Openix(options = {}) {
    this.opt = Object.assign(
        {
            destroyOnClose: true,
            footer: false,
            cssClass: [],
            closeMethods: ["button", "overlay", "escape"],
        },
        options
    );
    this.template = document.querySelector(`#${this.opt.templateId}`);

    if (!this.template) {
        console.error(`#${this.opt.templateId} does not exist!`);
        return;
    }

    const { closeMethods } = this.opt;
    this._allowButtonClose = closeMethods.includes("button");
    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");

    this._footerButtons = [];

    this._handleEscapeKey = this._handleEscapeKey.bind(this);
}

Openix.prototype._built = function () {
    const content = this.template.content.cloneNode(true);

    // createElement
    this._backdrop = document.createElement("div");
    this._backdrop.className = "openix__backdrop";

    const container = document.createElement("div");
    container.className = "openix__container";

    this.opt.cssClass.forEach((className) => {
        if (typeof className === "string") {
            container.classList.add(className);
        }
    });

    if (this._allowButtonClose) {
        const closeBtn = this._createButton("&times;", "openix__close", () =>
            this.close()
        );
        container.append(closeBtn);
    }

    const modalContent = document.createElement("div");
    modalContent.className = "openix__content";

    // Append content and elements
    modalContent.append(content);
    container.append(modalContent);

    if (this.opt.footer) {
        //
        this._modalFooter = document.createElement("div");
        this._modalFooter.className = "openix__footer";

        this._renderFooterContent();
        this._renderFooterButtons();

        container.append(this._modalFooter);
    }

    this._backdrop.append(container);
    document.body.append(this._backdrop);
};

Openix.prototype.setFooterContent = function (html) {
    //
    this._footerContent = html;
    this._renderFooterContent();
};

Openix.prototype.addFooterButton = function (title, cssClass, callback) {
    const button = this._createButton(title, cssClass, callback);
    this._footerButtons.push(button);

    this._renderFooterButtons();
};

Openix.prototype._renderFooterContent = function () {
    if (this._modalFooter && this._footerContent) {
        this._modalFooter.innerHTML = this._footerContent;
    }
};

Openix.prototype._renderFooterButtons = function () {
    if (this._modalFooter) {
        this._footerButtons.forEach((button) => {
            //
            this._modalFooter.append(button);
        });
    }
};

Openix.prototype._createButton = function (title, cssClass, callback) {
    const button = document.createElement("button");
    button.className = cssClass;
    button.innerHTML = title;
    button.onclick = callback;

    return button;
};

Openix.prototype.open = function () {
    Openix.elements.push(this);

    if (!this._backdrop) {
        this._built();
    }

    setTimeout(() => {
        this._backdrop.classList.add("openix--show");
    }, 0);

    // Disable scrolling
    document.body.classList.add("openix--no-scroll");

    /**
     * tính kích thước của thanh scrollbar để khi tắt mở
     * modal form phần nội dung không bị giật lag
     */
    document.body.style.paddingRight = this._getScrollbarWidth() + "px";

    // Attach event listeners
    if (this._allowBackdropClose) {
        this._backdrop.onclick = (e) => {
            if (e.target === this._backdrop) {
                this.close();
            }
        };
    }

    // bấm esc để tắt modal
    if (this._allowEscapeClose) {
        document.addEventListener("keydown", this._handleEscapeKey);
    }

    this._onTransitionEnd(this.opt.onOpen);

    return this._backdrop;
};

Openix.prototype._handleEscapeKey = function (e) {
    const lastModal = Openix.elements[Openix.elements.length - 1];

    if (e.key === "Escape" && this === lastModal) {
        this.close();
    }
};

Openix.prototype._onTransitionEnd = function (callback) {
    this._backdrop.ontransitionend = (e) => {
        if (e.propertyName !== "transform") return;
        if (typeof callback === "function") callback();
    };
};

Openix.prototype.close = function (destroy = this.opt.destroyOnClose) {
    Openix.elements.pop();

    this._backdrop.classList.remove("openix--show");

    if (this._allowEscapeClose) {
        document.removeEventListener("keydown", this._handleEscapeKey);
    }

    this._onTransitionEnd(() => {
        if (this._backdrop && destroy) {
            this._backdrop.remove();
            this._backdrop = null;
            this._modalFooter = null;
        }

        // Enable scrolling
        if (!Openix.elements.length) {
            document.body.classList.remove("openix--no-scroll");

            /**
             *
             * loại bỏ kích thước scrollbar (hàm getScrollbarWidth() bên dưới)
             * modal form phần nội dung không bị giật lag
             */
            document.body.style.paddingRight = "";
        }

        if (typeof this.opt.onClose === "function") this.opt.onClose();
    });
};

Openix.prototype.destroy = function () {
    this.close(true);
};

/**
 * hàm tính toán thanh cuộn trên mọi trình duyệt khác nhau,
 * mục đích không làm nội dung của trình duyệt giật lag khi bật tắt modal
 * @returns
 */

Openix.prototype._getScrollbarWidth = function () {
    if (this._scrollbarWidth) return this._scrollbarWidth;

    const div = document.createElement("div");

    Object.assign(div.style, {
        overflow: "scroll",
        position: "absolute",
        top: "-9999px",
    });

    document.body.appendChild(div);

    this._scrollbarWidth = div.offsetWidth - div.clientWidth;

    document.body.removeChild(div);

    return this._scrollbarWidth;
};
