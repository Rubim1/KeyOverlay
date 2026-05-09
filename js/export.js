document.addEventListener('DOMContentLoaded', () => {
    const btnExport = document.getElementById('btn-export');
    const btnImport = document.getElementById('file-import');

    if (btnExport) {
        btnExport.addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Config.current, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "keyoverlay_config.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    }

    if (btnImport) {
        btnImport.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    Config.update(parsed);
                    if (typeof Editor !== 'undefined') {
                        Editor.populateValues();
                    }
                    alert('Configuration imported successfully!');
                } catch (err) {
                    console.error("Error parsing JSON", err);
                    alert("Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        });
    }
});
