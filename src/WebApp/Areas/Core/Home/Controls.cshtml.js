const controls = document.querySelectorAll("[data-control]");
for (let i = 0; i < controls.length; ++i) {
    const element = controls[i];
    const properties = {
        text: "Hello World!"
    };
    const dxControl = new DevExpress.ui.dxTextBox(element, properties);
}
//# sourceMappingURL=Controls.cshtml.js.map