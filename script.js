function applyThemeBasedOnTime() {
    const currentHour = new Date().getHours();
    const body = document.body;

    if (currentHour >= 6 && currentHour < 18) {
        // Light theme
        body.style.backgroundColor = '#fff';
        body.style.color = '#000';
    } else {
        // Dark theme
        body.style.backgroundColor = '#000';
        body.style.color = '#fff';
    }
}

// Apply theme on page load
applyThemeBasedOnTime();

document.getElementById('generateBtn').addEventListener('click', function() {
    const qrInput = document.getElementById('qrInput').value.trim();
    const qrCanvas = document.getElementById('qrCanvas');
    const qrResult = document.getElementById('qrResult');
    const generateBtn = document.getElementById('generateBtn');

    if (qrInput) {
        qrResult.textContent = 'Gerando QR Code...';
        QRCode.toCanvas(qrCanvas, qrInput, function(error) {
            if (error) {
                console.error(error);
                qrResult.textContent = 'Erro ao gerar QR Code.';
            } else {
                qrResult.textContent = 'QR Code gerado com sucesso!';
                generateBtn.style.display = 'none'; // Hide the generate button
                document.getElementById('saveBtn').style.display = 'block'; // Show save button
            }
        });
    } else {
        qrResult.textContent = 'Por favor, digite o texto para gerar QR Code.';
    }
});

document.getElementById('saveBtn').addEventListener('click', function() {
    const qrCanvas = document.getElementById('qrCanvas');
    const link = document.createElement('a');
    link.href = qrCanvas.toDataURL('image/png');
    link.download = 'QRCode-0001.png';
    link.click();
    alert('QR Code salvo. Verifique sua pasta de Downloads no PC ou Galeria no celular.');
});

document.getElementById('readBtn').addEventListener('click', function() {
    const qrFile = document.getElementById('qrFile').files[0];
    const qrResult = document.getElementById('qrResult');

    if (qrFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);

                const imageData = context.getImageData(0, 0, img.width, img.height);
                const qrCode = jsQR(imageData.data, img.width, img.height);
                if (qrCode) {
                    qrResult.textContent = `Conteúdo do QR Code: ${qrCode.data}`;
                    if (qrCode.data.length > 50) { // Verificar se o texto é grande
                        const textLink = document.createElement('a');
                        const blob = new Blob([qrCode.data], { type: 'text/plain' });
                        textLink.href = URL.createObjectURL(blob);
                        textLink.download = 'QRCode-text0001.txt';
                        textLink.click();
                    }
                } else {
                    qrResult.textContent = 'Nenhum QR Code encontrado.';
                }
            };
            img.src = event.target.result;
        };
        reader.onerror = function() {
            qrResult.textContent = 'Erro ao ler o arquivo de QR Code.';
        };
        reader.readAsDataURL(qrFile);
    } else {
        qrResult.textContent = 'Por favor, selecione um arquivo de imagem de QR Code.';
    }
});