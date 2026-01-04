const N8N_URL = "https://basecero-n8n-ia-team.hf.space/webhook";
let agenteActivo = "producto";

const nombresAgentes = {
    'producto': 'Producto & UX',
    'copy': 'Copy & Marketing',
    'legal': 'Legal & Contratos',
    'desarrollo': 'Desarrollo & Ops',
    'qa': 'Auditoría QA'
};

const endpoints = {
    'producto': 'agente-producto',
    'copy': 'agente-copy',
    'legal': 'agente-legal',
    'desarrollo': 'agente-desarrollo',
    'qa': 'agente-qa'
};

function cambiarAgente(agente, element) {
    agenteActivo = agente;
    document.querySelectorAll('.agent-btn').forEach(b => b.classList.remove('active'));
    element.classList.add('active');
    
    addMessage('bot', `Ahora estás hablando con el especialista en **${nombresAgentes[agente]}**. ¿Qué quieres consultar?`);
}

async function ejecutarMaestro() {
    const tarea = document.getElementById('tareaMaestra').value;
    if(!tarea) return alert("Por favor, describe tu proyecto.");

    const btn = document.getElementById('btnMaestro');
    btn.disabled = true;
    btn.textContent = "Procesando Propuesta Integral...";

    try {
        const response = await fetch(`${N8N_URL}/master-workflow`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ tarea })
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Propuesta-BaseCero-${Date.now()}.md`;
        a.click();
        
        btn.textContent = "¡Reporte Generado!";
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = "Generar Reporte Integral (.md)";
        }, 3000);

    } catch (e) {
        alert("Error al conectar con el servidor.");
        btn.disabled = false;
    }
}

async function enviarMensaje() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if(!msg) return;

    addMessage('user', msg);
    input.value = '';

    try {
        const response = await fetch(`${N8N_URL}/${endpoints[agenteActivo]}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ tarea: msg })
        });
        const data = await response.text();
        addMessage('bot', data);
    } catch (e) {
        addMessage('bot', "Error: No se pudo obtener respuesta del especialista.");
    }
}

function addMessage(type, text) {
    const display = document.getElementById('chatDisplay');
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.innerHTML = text.replace(/\n/g, '<br>');
    display.appendChild(div);
    display.scrollTop = display.scrollHeight;
}