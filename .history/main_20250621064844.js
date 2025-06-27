const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// kiểm tra xem có lấy được phần tử form không?
console.log($("#modal-2"));

{
    /* <div id="modal-1" class="modal-backdrop">
    <div class="modal-container">
        <button id="modal-close" class="modal-close">
            &times;
        </button>
        <div class="modal-content">
            <h2>Modal 1</h2>
            <p>...</p>
        </div>
    </div>
</div>; */
}

function Modal() {
    this.openModal = (options = {}) => {
        const { templateId } = options;
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
        backdrop.onclick = (e) => {
            //
            if (e.target === backdrop) {
                this.closeModal(backdrop);
            }
        };

        // bấm esc để tắt modal
        document.addEventListener("keydown", (e) => {
            if ((e.key = "Escape")) {
                this.closeModal(backdrop);
            }
        });
    };

    this.closeModal = (backdrop) => {
        backdrop.classList.remove("show");
        backdrop.ontransitionend = () => {
            backdrop.remove();
        };
    };
}

const modal = new Modal();

// Open Modal 1
$("#open-modal-1").onclick = () => {
    modal.openModal({
        templateId: "modal-1",
    });
};

// Open Modal 2
$("#open-modal-2").onclick = () => {
    modal.openModal({
        templateId: "modal-2",
    });
};

// 1. Xử lý được sự kiện submit form, lấy được giá trị của input khi submit
// 2. Thêm tuỳ chọn bật/tắt cho phép click vào overlay để đóng modal
// 3. không cho phép cuộn trang khi modal hiển thị
