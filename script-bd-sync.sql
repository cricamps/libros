-- ============================================================
-- ACTUALIZACIÓN SCRIPT BD ORACLE CLOUD - TiendaOnline
-- Agrega columna DISPONIBLE como NUMBER(1) si no existe
-- y sincroniza con el modelo Boolean de JPA
-- ============================================================

-- Si DISPONIBLE es NUMBER(1) en Oracle, JPA Boolean lo lee como 1/0
-- Verificar con: SELECT COLUMN_NAME, DATA_TYPE FROM USER_TAB_COLUMNS WHERE TABLE_NAME='PRODUCTOS';

-- Actualizar productos con DISPONIBLE null
UPDATE PRODUCTOS SET DISPONIBLE = 1 WHERE DISPONIBLE IS NULL AND STOCK > 0;
UPDATE PRODUCTOS SET DISPONIBLE = 0 WHERE DISPONIBLE IS NULL AND STOCK = 0;
COMMIT;

-- Verificar
SELECT ID, NOMBRE, STOCK, DISPONIBLE FROM PRODUCTOS ORDER BY ID;
