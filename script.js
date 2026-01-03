        let agenteActual = null;
        const agentes = {
            'producto': { nombre: 'Producto/UX', endpoint: 'agente-producto' },
            'copy': { nombre: 'Copy/Marketing', endpoint: 'agente-copy' },
            'legal': { nombre: 'Legal/Contratos', endpoint: 'agente-legal' },
            'desarrollo': { nombre: 'Desarrollo/Ops', endpoint: 'agente-desarrollo' },
            'qa': { nombre: 'QA/Auditoría', endpoint: 'agente-qa' }
        };

        function seleccionarAgente(tipo) {
            document.querySelectorAll('.agent-card').forEach(card => {
                card.classList.remove('active');
            });
            event.target.closest('.agent-card').classList.add('active');
            
            agenteActual = tipo;
            document.getElementById('agenteSeleccionado').textContent = agentes[tipo].nombre;
            document.getElementById('btnConsultarAgente').disabled = false;
        }

        async function consultarOrquestador() {
            const tarea = document.getElementById('tareaOrquestador').value.trim();
            
            if (!tarea) {
                alert('Por favor ingresá una tarea');
                return;
            }

            const respuestaArea = document.getElementById('respuestaArea');
            respuestaArea.innerHTML = '<div class="loading"><div class="spinner"></div> Orquestador analizando...</div>';

            try {
                const n8nUrl = document.getElementById('n8nUrl').value.trim();
                const response = await fetch(`${n8nUrl}/orquestador`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tarea })
                });

                const data = await response.json();
                document.getElementById('briefArea').textContent = data.analisis;
                respuestaArea.textContent = data.analisis;
            } catch (error) {
                respuestaArea.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
            }
        }

        async function consultarAgente() {
            if (!agenteActual) {
                alert('Seleccioná un agente primero');
                return;
            }

            const tarea = document.getElementById('tareaAgente').value.trim();
            const brief = document.getElementById('briefArea').textContent;
            
            if (!tarea) {
                alert('Por favor ingresá una tarea o brief para el agente');
                return;
            }

            const respuestaArea = document.getElementById('respuestaArea');
            respuestaArea.innerHTML = `<div class="loading"><div class="spinner"></div> ${agentes[agenteActual].nombre} trabajando...</div>`;

            try {
                const n8nUrl = document.getElementById('n8nUrl').value.trim();
                const response = await fetch(`${n8nUrl}/${agentes[agenteActual].endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tarea, brief })
                });

                const data = await response.json();
                respuestaArea.textContent = `[${data.agente}]\n\n${data.respuesta}`;
            } catch (error) {
                respuestaArea.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
            }
        }

        function limpiar(elementId) {
            document.getElementById(elementId).value = '';
        }