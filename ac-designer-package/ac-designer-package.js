export function initializeDesigner(containerId, sampleData, templateJson) {
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const loadAllScripts = async () => {
    try {
      // Load all necessary scripts
      await loadScript(
        'https://unpkg.com/adaptivecards@latest/dist/adaptivecards.min.js'
      );
      await loadScript(
        'https://unpkg.com/adaptive-expressions@4/lib/browser.js'
      );
      await loadScript(
        'https://unpkg.com/adaptivecards-templating@latest/dist/adaptivecards-templating.min.js'
      );
      await loadScript(
        'https://unpkg.com/markdown-it@8.4.0/dist/markdown-it.min.js'
      );
      await loadScript(
        'https://unpkg.com/adaptivecards-designer@latest/dist/adaptivecards-designer-standalone.min.js'
      );
      await loadScript(
        'https://unpkg.com/monaco-editor@0.17.1/min/vs/loader.js'
      );

      // Ensure Monaco is correctly loaded
      require.config({
        paths: { vs: 'https://unpkg.com/monaco-editor@0.17.1/min/vs' },
      });
      require(['vs/editor/editor.main'], initializeDesignerInstance);
    } catch (error) {
      console.error('Error loading scripts:', error);
    }
  };

  const initializeDesignerInstance = () => {
    ACDesigner.GlobalSettings.enableDataBindingSupport = true;
    ACDesigner.GlobalSettings.showSampleDataEditorToolbox = true;
    ACDesigner.GlobalSettings.showVersionPicker = true;
    ACDesigner.GlobalSettings.selectedHostContainerControlsTargetVersion = true;
    ACDesigner.GlobalSettings.showTargetVersionMismatchWarning = false;

    // Set the sample data object
    ACDesigner.GlobalSettings.sampleData = sampleData;

    let hostContainers = ACDesigner.defaultMicrosoftHosts;

    let designer = new ACDesigner.CardDesigner(hostContainers);

    // The designer requires various CSS and image assets to work properly,
    // If you've loaded the script from a CDN it needs to know where these assets are located
    designer.assetPath = 'https://unpkg.com/adaptivecards-designer@latest/dist';

    // Attach the designer to the specified div
    designer.attachTo(document.getElementById(containerId));

    // Initialize monaco-editor for the JSON-editor pane
    require.config({
      paths: { vs: 'https://unpkg.com/monaco-editor@0.17.1/min/vs' },
    });
    require(['vs/editor/editor.main'], function () {
      designer.monacoModuleLoaded();

      // Set the sample data for the designer
      designer.sampleData = ACDesigner.GlobalSettings.sampleData;
      designer.bindingPreviewMode = ACDesigner.BindingPreviewMode.SampleData;
    });

    // Load the template if provided
    if (templateJson) {
      designer.setCardPayload(templateJson);
    }
  };

  loadAllScripts();
}
