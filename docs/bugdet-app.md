# App de presupuesto

Usa los screenhots para crear la app de presupuesto.

El proyecto está orientado a dispositivos móviles con la última versión de vue, scss sin scope.

La pantalla principal de la aplicación está dividida en tres secciones:

Bloque 1: Contiene los items de ingresos y un botón para agregar un nuevo item.

Bloque 2: Contiene los items de cuentas y un botón para agregar un nuevo item.

Bloque 3: Contiene los items de gastos y un botón para agregar un nuevo item.

Los items de ingresos pueden arrastrarse usando drag and drop para mover dinero a los items de cuentas, este dinero se descuenta del ingreso y se agrega a la cuenta, además de guardar un registro con la fecha y el importe.

Los items de cuentas pueden arrastrarse usando drag and drop para mover dinero a los items de gastos, este dinero se descuenta de la cuenta y se agrega al gasto, además de guardar un registro con la fecha y el importe.

Al hacer drag and drop se muestra un modal para ingresar el importe.

Al hacer un click/touch simple se muestra un modal con todas las transacciones relacionadas con el item, al hacer un swipe a la izquierda en un registro la transacción se revierte.

Al hacer un click/touch largo en un item se habilitan los botones de editar y eliminar.

Al seleccionar el botón de eliminar se muestra un modal para confirmar la eliminación.

Al seleccionar el botón de editar se muestra un modal para editar el item.

Los items de ingreso tienen los campos nombre, monto e icono.
Los items de cuenta tienen los campos nombre, monto, icono y un switch para incluír el importe en el indicador de saldo.
Los items de gastos tienen los campos nombre, monto, icono.

El indicador de saldo se calcula sumando los importes de los items de cuentas.

## En el menú lateral existen varios items
1. **Inicio**: Ir al inicio de la aplicación
2. **Estadísticas**: Muestra los datos de los gastos por mes y año en formato de torta
3. **Historia**: Muestra los datos de Ingresos/Gastos minímos, promedio y máximos, además de una gráfica lineal de gatos e ingresos por mes
4. **Exportar Datos**: Exportar los datos de la aplicación en formato json y csv
5. **Configuración de Moneda**: Cambiar el símbolo de moneda que se muestra en la aplicación



