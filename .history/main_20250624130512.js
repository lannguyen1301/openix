const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// kiểm tra xem có lấy được phần tử form không?
console.log($("#modal-2").content.querySelector("#login-form"));

function Modal() {
    let _scrollbarWidth;
    /**
     * hàm tính toán thanh cuộn trên mọi trình duyệt khác nhau,
     * mục đích không làm nội dung của trình duyệt giật lag khi bật tắt modal
     * @returns
     */

    function getScrollbarWidth() {
        if (_scrollbarWidth) {
            console.log("Trả về giá trị đã lưu trước đó(không tính lại)");
        }

        const div = document.createElement("div");

        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });

        document.body.appendChild(div);

        const scrollbarWidth = div.offsetWidth - div.clientWidth;

        document.body.removeChild(div);

        console.log("Tính toán kích thước thanh cuộn: ", scrollbarWidth);

        return scrollbarWidth;
    }

    this.openModal = (options = {}) => {
        const { templateId, allowBackdropClose = true } = options;
        const template = $(`#${templateId}`);

        if (!template) {
            console.error(`#${templateId} does not exist!`);
            return;
        }

        const content = template.content.cloneNode(true);

        // createElement
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        const closeBtn = document.createElement("button");
        closeBtn.className = "modal-close";
        closeBtn.innerHTML = "&times;";

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and elements
        modalContent.append(content);
        container.append(closeBtn, modalContent);
        backdrop.append(container);
        document.body.append(backdrop);

        setTimeout(() => {
            backdrop.classList.add("show");
        }, 0);

        // Attach event listeners
        closeBtn.onclick = () => this.closeModal(backdrop);

        if (allowBackdropClose) {
            backdrop.onclick = (e) => {
                //
                if (e.target === backdrop) {
                    this.closeModal(backdrop);
                }
            };
        }

        // bấm esc để tắt modal
        document.addEventListener("keydown", (e) => {
            if ((e.key = "Escape")) {
                this.closeModal(backdrop);
            }
        });

        // Disable scrolling
        document.body.classList.add("no-scroll");

        /**
         * tính kích thước của thanh scrollbar để khi tắt mở
         * modal form phần nội dung không bị giật lag
         */
        document.body.style.paddingRight = getScrollbarWidth() + "px";

        return backdrop;
    };

    this.closeModal = (backdrop) => {
        backdrop.classList.remove("show");
        backdrop.ontransitionend = () => {
            backdrop.remove();

            // Enable scrolling
            document.body.classList.remove("no-scroll");

            /**
             *
             * loại bỏ kích thước scrollbar (hàm getScrollbarWidth() bên dưới)
             * modal form phần nội dung không bị giật lag
             */
            document.body.style.paddingRight = "";
        };
    };
}

const modal = new Modal();

// Open Modal 1
$("#open-modal-1").onclick = () => {
    const modalElement = modal.openModal({
        templateId: "modal-1",
    });

    const img = modalElement.querySelector("img");
    console.log(img);
};

// Open Modal 2
$("#open-modal-2").onclick = () => {
    const modalElement = modal.openModal({
        templateId: "modal-2",
        allowBackdropClose: false,
    });

    const form = modalElement.querySelector("#login-form");

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = {
                // .value.trim() loại bỏ khoảng trắng thừa
                email: $("#email").value.trim(),
                password: $("#password").value.trim(),
            };
            console.log(formData);
        };
    }
};

/**
 * hàm tính toán thanh cuộn trên mọi trình duyệt khác nhau,
 * mục đích không làm nội dung của trình duyệt giật lag khi bật tắt modal
 * @returns
 */

// function getScrollbarWidth() {
//     const div = document.createElement("div");

//     Object.assign(div.style, {
//         overflow: "scroll",
//         position: "absolute",
//         top: "-9999px",
//     });

//     document.body.appendChild(div);

//     const scrollbarWidth = div.offsetWidth - div.clientWidth;

//     document.body.removeChild(div);

//     return scrollbarWidth;
// }

// console.log(getScrollbarWidth());

// 1. Xử lý được sự kiện submit form, lấy được giá trị của input khi submit
// 2. Thêm tuỳ chọn bật/tắt cho phép click vào overlay để đóng modal
// 3. không cho phép cuộn trang khi modal hiển thị
