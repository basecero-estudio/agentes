let agenteActual = 'orquestador';
const agentes = {
    'orquestador': { nombre: 'Orquestador', endpoint: 'orquestador' },
    'producto': { nombre: 'Producto/UX', endpoint: 'agente-producto' },
    'copy': { nombre: 'Copy/Marketing', endpoint: 'agente-copy' },
    'legal': { nombre: 'Legal/Contratos', endpoint: 'agente-legal' },
    'desarrollo': { nombre: 'Desarrollo/Ops', endpoint: 'agente-desarrollo' },
    'qa': { nombre: 'QA/Auditoría', endpoint: 'agente-qa' }
};

function seleccionarAgente(tipo) {
    agenteActual = tipo;
    document.querySelectorAll('.agent-item').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('agenteSeleccionado').textContent = agentes[tipo].nombre;
    addMessage('bot', `Has cambiado al canal de **${agentes[tipo].nombre}**. ¿En qué puedo ayudarte con este módulo?`);
}

async function enviarMensajeChat() {
    const input = document.getElementById('chatInput');
    const tarea = input.value.trim();
    if (!tarea) return;

    addMessage('user', tarea);
    input.value = '';
    
    const n8nUrl = document.getElementById('n8nUrl').value.trim();
    setStatus('Procesando...', 'status-online');

    try {
        const response = await fetch(`${n8nUrl}/${agentes[agenteActual].endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tarea })
        });

        // Manejamos si la respuesta es texto plano o JSON
        const data = await response.text();
        addMessage('bot', data);
    } catch (error) {
        addMessage('bot', `❌ Error de conexión: ${error.message}`);
    } finally {
        setStatus('Online', 'status-online');
    }
}

async function ejecutarMaestro() {
    const tarea = document.getElementById('tareaOrquestador').value.trim();
    if (!tarea) return alert("Ingresa una tarea para el reporte maestro");

    const btn = document.getElementById('btnMaestro');
    btn.disabled = true;
    btn.textContent = "⚙️ Generando Propuesta (espera 10s)...";

    try {
        const n8nUrl = document.getElementById('n8nUrl').value.trim();
        const response = await fetch(`${n8nUrl}/master-workflow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tarea })
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'propuesta-base-cero.md';
        document.body.appendChild(a);
        a.click();
        a.remove();
        addMessage('bot', '✅ ¡Reporte Maestro generado y descargado con éxito!');
    } catch (error) {
        alert("Error en Workflow Maestro: " + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = "Iniciar Workflow Maestro";
    }
}

function addMessage(sender, text) {
    const chatBox = document.getElementById('chatBox');
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerHTML = text.replace(/\n/g, '<br>');
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function setStatus(text, className) {
    const s = document.getElementById('statusBadge');
    s.textContent = text;
    s.className = className;
}

function handleKeyPress(e) { if (e.key === 'Enter') enviarMensajeChat(); }
function limpiar(id) { document.getElementById(id).value = ''; }