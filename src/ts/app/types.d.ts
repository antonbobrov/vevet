type EasingType = any;

export namespace NApplication {

    /**
     * Properties
     */
    export type Prop = {
        /**
         * Page name
         * @default 'home'
         */
        pagename: string;
        /**
         * Tablet identification max width
         * @default 1199
         */
        tablet: number;
        /**
         * Mobile identification max width
         * @default 899
         */
        mobile: number;
        /**
         * Vevet prefix
         * @default 'v-'
         */
        prefix: string;
        /**
         * Maximum timeout of waiting for a response from an ajax request
         * @default 5000
         */
        maxAjaxTimeout: number;
        /**
         * Timeout of viewport callbacks
         * @default 0
         */
        viewportResizeTimeout: number;
        /**
         * Easing function that is used in animation as the default value
         * @default [.25, .1, .25, 1]
         */
        easing: EasingType;
    }

}
