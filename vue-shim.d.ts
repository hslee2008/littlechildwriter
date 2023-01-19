import Vue from "vue";

declare module "perspective-api-client";
declare module "*.vue" {
  export default Vue;
}
declare module "vue/types/vue" {
  interface Vue {
    BarcodeDetector: any;
  }
}

declare global {
  interface Window {
    BarcodeDetector: any;
    webkitSpeechRecognition: any;
  }
}
