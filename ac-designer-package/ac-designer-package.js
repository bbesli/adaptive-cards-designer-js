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
      await loadScript('https://cdn.jsdelivr.net/npm/adaptivecards/dist/adaptivecards.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/adaptive-expressions/lib/browser.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/adaptivecards-templating/dist/adaptivecards-templating.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js');
      await loadScript('ac-designer-package/adaptivecard-depencencies/adaptivecards-designer.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/loader.js');

      // Ensure Monaco is correctly loaded
      require.config({
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' },
      });
      require(['vs/editor/editor.main'], () => {
        ACDesigner.GlobalSettings.enableDataBindingSupport = true;
        ACDesigner.GlobalSettings.showSampleDataEditorToolbox = true;
        ACDesigner.GlobalSettings.showVersionPicker = true;
        ACDesigner.GlobalSettings.selectedHostContainerControlsTargetVersion = true;
        ACDesigner.GlobalSettings.showTargetVersionMismatchWarning = false;

        ACDesigner.GlobalSettings.sampleData = sampleData;

        let hostContainers = ACDesigner.defaultMicrosoftHosts;
        let designer = new ACDesigner.CardDesigner(hostContainers);
        designer.assetPath = 'https://cdn.jsdelivr.net/npm/adaptivecards-designer/dist';
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
