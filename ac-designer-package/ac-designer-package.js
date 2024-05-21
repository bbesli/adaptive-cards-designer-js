export function initializeDesigner(containerId, sampleData, templateJson) {
  return new Promise(async (resolve, reject) => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    try {
      // Load all necessary scripts
      await loadScript('https://unpkg.com/adaptivecards@latest/dist/adaptivecards.min.js');
      await loadScript('https://unpkg.com/adaptive-expressions@4/lib/browser.js');
      await loadScript('https://unpkg.com/adaptivecards-templating@latest/dist/adaptivecards-templating.min.js');
      await loadScript('https://unpkg.com/markdown-it@8.4.0/dist/markdown-it.min.js');
      await loadScript('https://unpkg.com/adaptivecards-designer@latest/dist/adaptivecards-designer-standalone.min.js');
      await loadScript('https://unpkg.com/monaco-editor@0.17.1/min/vs/loader.js');

      // Ensure Monaco is correctly loaded
      require.config({
        paths: { vs: 'https://unpkg.com/monaco-editor@0.17.1/min/vs' },
      });
      require(['vs/editor/editor.main'], () => {
        ACDesigner.GlobalSettings.enableDataBindingSupport = true;
        ACDesigner.GlobalSettings.showSampleDataEditorToolbox = true;
        ACDesigner.GlobalSettings.showVersionPicker = true;
        ACDesigner.GlobalSettings.selectedHostContainerControlsTargetVersion = true;
        ACDesigner.GlobalSettings.showTargetVersionMismatchWarning = false;

        ACDesigner.GlobalSettings.sampleData = sampleData;

        let designer = new ACDesigner.CardDesigner();
        designer.assetPath = 'https://unpkg.com/adaptivecards-designer@latest/dist';
        designer.attachTo(document.getElementById(containerId));

        designer.monacoModuleLoaded();
        designer.sampleData = ACDesigner.GlobalSettings.sampleData;
        designer.bindingPreviewMode = ACDesigner.BindingPreviewMode.SampleData;

        if (templateJson) {
          designer.setCardPayload(templateJson);
        }

        resolve(designer);
      });
    } catch (error) {
      console.error('Error loading scripts:', error);
      reject(error);
    }
  });
}
