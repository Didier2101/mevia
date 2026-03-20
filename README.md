# Túnel SSH para acceder al frontend de la VM

## Propósito

Permitir abrir en el navegador de la **PC local** el frontend que está ejecutándose dentro de la **máquina virtual**.

Esto es útil cuando:

* El frontend corre en la VM
* El backend también corre en la VM
* Solo el navegador se usa desde la PC local

El túnel SSH redirige el puerto del navegador local hacia el puerto de la VM.

---

## Arquitectura

PC local:

```
http://localhost:5500
```

Túnel SSH:

```
localhost:5500  →  VM:localhost:5500
```

VM:

```
Frontend: http://localhost:5500
Backend:  http://localhost:3000
```

El navegador cree que accede a `localhost`, pero el tráfico viaja por SSH hacia la VM.

---

## Comando para abrir el túnel

Desde **CMD o PowerShell en la PC local** ejecutar:

```
ssh -L 5500:localhost:5500 didier@192.168.2.57
ssh -L 3000:localhost:3000 didier@192.168.2.57
```

Explicación del comando:

* `ssh` → conexión segura al servidor
* `-L` → redirección de puerto local
* `5500:localhost:5500` → redirige el puerto 5500 local al puerto 5500 en la VM
* `didier@192.168.2.57` → usuario e IP de la VM

El túnel permanece activo mientras la sesión SSH esté abierta.

---

## Acceder al frontend

Una vez abierto el túnel, abrir en el navegador:

```
http://localhost:5500/mevia/fletes.html
```

---

## Verificación del túnel

Se puede probar con:

```
curl http://localhost:5500
```

Si el túnel está activo, responderá el servidor que está en la VM.

---

## Cerrar el túnel

Cerrar la terminal donde está ejecutándose el comando `ssh`.

---

## Notas

Este método evita problemas de red o firewall al acceder directamente a la VM y permite trabajar con el navegador local sin modificar la configuración del servidor.
