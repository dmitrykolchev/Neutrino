

const controls = document.querySelectorAll("[data-control]");
for (let i = 0; i < controls.length; ++i) {
    const element: HTMLElement = controls[i] as HTMLElement;
    const properties: DevExpress.ui.dxTextBox.Properties = {
        text: "Hello World!"
    }
    const dxControl = new DevExpress.ui.dxTextBox(element, properties);
}
