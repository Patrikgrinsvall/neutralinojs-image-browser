class Toast {
    constructor(config = { position: 'top' }) {
        this.config = config;
        this.toastContainer = this.createToastContainer(this.config.position);
        document.body.appendChild(this.toastContainer);
        this.translateLen = "100px";
        this.messages = [];
        this.maxMessages = 10;
        this.ttl = config.ttl || 5000;
    }

    createToastContainer(position) {
        const container = document.createElement('div');
        container.classList.add('absolute', 'transition-all', 'duration-500', 'text-center', 'left-10', 'right-10', 'transform', 'px-12', 'py-20', 'box-border', 'flex', 'flex-col', 'gap-[10px]');

        setInterval(() => {
            this.removeOldestToast();
        }, 5000);

        if (position === 'top') {
            container.classList.add('top-5');
        } else {
            container.classList.add('bottom-5');
        }

        return container;
    }

    createToast(message, type, image="") {
        const borderColor = {
            error: 'border-red-500',
            warn: 'border-orange-500',
            info: 'border-blue-500',
            success: 'border-green-500'
        }; const bgColor = {
            error: 'ripple-bg-red-100',
            warn: 'ripple-bg-orange-100',
            info: 'ripple-bg-blue-100',
            success: 'ripple-bg-green-100'
        };
        if (this.toastContainer) {
            const toasts = this.toastContainer.querySelectorAll('.toast-message');
            for (let i = 0; i < toasts.length; i++) {
                if (toasts[i].textContent === message) {
                    console.log('skipping duplicate message');
                    return;
                }
            }
        }

        const toast = document.createElement('div');
        toast.classList.add('toast', 'transition-all', 'duration-1000', bgColor[type], 'text-gray-900', 'border-l-4', 'shadow-lg', 'rounded-md', 'py-2', 'px-4', 'flex', 'justify-between', 'items-center', 'space-x-4', 'cursor-pointer', borderColor[type], 'h-0', 'opacity-0');
        let icon = this.icon(type);
        toast.innerHTML = `
        <div class="flex flex-row justify-between items-center">
        <p class="w-fit h-fit">${icon} </p>
          <p class="text-lg font-medium inline-block w-full text-center px-4 toast-message">${message}</p>
        </div>
        <button class="close-btn text-gray-400 hover:text-gray-600">
          &times;
        </button>
      `;

        const closeButton = toast.querySelector('.close-btn');
        closeButton.addEventListener('click', () => {
            this.hideToast(toast);
        });

        toast.addEventListener('mouseenter', () => {
            toast.style.height = `${toast.scrollHeight}px`;
        });

        toast.addEventListener('mouseleave', () => {
            toast.style.height = '48px';
        });

        toast.addEventListener('click', () => {
            toast.classList.remove("toast", bgColor[type], "text-gray-900");
            toast.classList.add("ripple-bg-gray-200", "text-black", "cursor-alias", "scale-105");

        });

        this.toastContainer.appendChild(toast);
        this.messages.push(toast);

        if (this.messages.length > this.maxMessages) {
            this.removeToast(this.messages.shift());
        }

        this.showToast(toast);
    }

    removeOldestToast() {
        if (this.toastContainer) {
            const toasts = this.toastContainer.querySelectorAll('.toast');
            if (toasts.length > 0) {
                const oldestToast = toasts[0];
                this.hideToast(oldestToast);

            }
        } else {
            console.log('no toast container found');
        }
    }

    showToast(toast) {
        //let translateClass = this.config.position === 'top' ? [`-translate-y-[${this.translateLen}]`, `translate-y-[${this.translateLen}]`] : [`translate-y-[${this.translateLen}]`, `-translate-y-[${this.translateLen}]`];
        let translateClass = this.config.position === 'top' ? ['-translate-y-[100px]', 'translate-y-[100px]'] : ['translate-y-[100px]', '-translate-y-[100px]'];
        toast.classList.add("h-20", "opacity-100", "z-50", translateClass[0]);
        toast.classList.remove("h-0", "opacity-0", "z-0", translateClass[1]);

    }

    hideToast(toast) {

        //let translateClass = this.config.position === 'top' ? [String(`translate-y-[${this.translateLen}]`), `-translate-y-[${this.translateLen}]`] : [`-translate-y-[${this.translateLen}]`, `translate-y-[${this.translateLen}]`];
        let translateClass = this.config.position === 'top' ? ['translate-y-[100px]', '-translate-y-[100px]'] : ['-translate-y-[100px]', 'translate-y-[100px]'];
        toast.classList.add("h-0", "opacity-0", "z-0", translateClass[0]);
        toast.classList.remove("h-20", "opacity-100", "z-50", translateClass[1]);
        toast.addEventListener('transitionend', () => {
            if (toast.parentElement) {
                this.toastContainer.removeChild(toast);
            }
        });
    }

    removeToast(toast) {
        this.hideToast(toast);
    }

    error(message) {
        this.createToast(message, 'error');
    }
    err(message) {
        this.error(message);
    }
    warn(message) {
        this.createToast(message, 'warn');
    }
    warning(message) {
        this.warn(message);
    }
    info(message,image="") {
        this.createToast(message, 'info',image);
    }

    success(message) {
        this.createToast(message, 'success');
    }
    infoIcon(style = "dark") {
        let strokes = ["#2c7daa", "#3F51B5"];
        let strokeColor = (style === "dark") ? strokes[0] : strokes[1];

        return `<svg version="1" stroke="${strokeColor}" stroke-width="2px"  class="h-12 w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enable-background="new 0 0 48 48">
    <g fill="#90CAF9">
        <path d="M17.4,33H15v-4h4l0.4,1.5C19.7,31.8,18.7,33,17.4,33z"/>
        <path d="M37,36c0,0-11.8-7-18-7V15c5.8,0,18-7,18-7V36z"/>
    </g>
    <g fill="#283593">
        <circle cx="9" cy="22" r="5"/>
        <path d="M40,19h-3v6h3c1.7,0,3-1.3,3-3S41.7,19,40,19z"/>
        <path d="M18.6,41.2c-0.9,0.6-2.5,1.2-4.6,1.4c-0.6,0.1-1.2-0.3-1.4-1L8.2,27.9c0,0,8.8-6.2,8.8,1.1 c0,5.5,1.5,8.4,2.2,9.5c0.5,0.7,0.5,1.6,0,2.3C19,41,18.8,41.1,18.6,41.2z"/>
    </g>
    <path fill="#3F51B5" d="M9,29h10V15H9c-1.1,0-2,0.9-2,2v10C7,28.1,7.9,29,9,29z"/>
    <path fill="#42A5F5" d="M38,38L38,38c-1.1,0-2-0.9-2-2V8c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v28C40,37.1,39.1,38,38,38z"/>
</svg>
`;
    }
    errorIcon(style = "dark") {
        let strokes = ["#960e04", "#ffaaaa"];
        let strokeColor = (style === "dark") ? strokes[0] : strokes[1];

        return `<svg version="1" stroke="${strokeColor}" stroke-width="2px"  class="h-12 w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enable-background="new 0 0 48 48">
        <path   fill="#F44336" d="M21.2,44.8l-18-18c-1.6-1.6-1.6-4.1,0-5.7l18-18c1.6-1.6,4.1-1.6,5.7,0l18,18c1.6,1.6,1.6,4.1,0,5.7l-18,18 C25.3,46.4,22.7,46.4,21.2,44.8z"/>
        <path fill="#fff" d="M21.6,32.7c0-0.3,0.1-0.6,0.2-0.9c0.1-0.3,0.3-0.5,0.5-0.7c0.2-0.2,0.5-0.4,0.8-0.5s0.6-0.2,1-0.2 s0.7,0.1,1,0.2c0.3,0.1,0.6,0.3,0.8,0.5c0.2,0.2,0.4,0.4,0.5,0.7c0.1,0.3,0.2,0.6,0.2,0.9s-0.1,0.6-0.2,0.9s-0.3,0.5-0.5,0.7 c-0.2,0.2-0.5,0.4-0.8,0.5c-0.3,0.1-0.6,0.2-1,0.2s-0.7-0.1-1-0.2s-0.5-0.3-0.8-0.5c-0.2-0.2-0.4-0.4-0.5-0.7S21.6,33.1,21.6,32.7z M25.8,28.1h-3.6L21.7,13h4.6L25.8,28.1z"/>
    </svg>
    `;
    }
    successIcon(style = "dark") {
        let strokes = ["#56871d", "#effdaa"];
        let strokeColor = (style === "dark") ? strokes[0] : strokes[1];

        return `<svg version="1" stroke="${strokeColor}"  stroke-width="2px"  class="h-12 w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enable-background="new 0 0 48 48">
    <polygon   fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"/>
    <polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"/>
</svg>
`;
    }
    warningIcon(style = "dark") {
        let strokes = ["#c37917", "#ffeb3b"];
        let strokeColor = (style === "dark") ? strokes[0] : strokes[1];
        return `<svg version="1" stroke="${strokeColor}" stroke-width="2px"   class="h-12 w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enable-background="new 0 0 48 48">
        <path fill="#FFC107" d="M21.2,44.8l-18-18c-1.6-1.6-1.6-4.1,0-5.7l18-18c1.6-1.6,4.1-1.6,5.7,0l18,18c1.6,1.6,1.6,4.1,0,5.7l-18,18 C25.3,46.4,22.7,46.4,21.2,44.8z"/>
        <g fill="#37474F">
            <circle cx="24" cy="24" r="2"/>
            <circle cx="32" cy="24" r="2"/>
            <circle cx="16" cy="24" r="2"/>
        </g>
    </svg>
    `;
    }

    icon(status) {
        switch (status) {
            case 'info':
                return this.infoIcon();
            case 'error':
                return this.errorIcon();
            case 'success':
                return this.successIcon();
            case 'warn':
                return this.warningIcon();
            default:
                return this.infoIcon();
        }
    }
}
export const toast=new Toast({position: "bottom"})