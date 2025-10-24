const campos = document.querySelectorAll('.campo-input'); // pega todos os blocos com input + ícone

campos.forEach(campo => {
    const input = campo.querySelector('.input-dados');
    const icone = campo.querySelector('.icone-input');

    input.addEventListener('focus', () => {
        icone.style.display = 'none';
    });

    input.addEventListener('blur', () => {
        if (input.value === '') {
            icone.style.display = 'block';
        }
    });
});