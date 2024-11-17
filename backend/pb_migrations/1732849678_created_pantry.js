/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "d0gzbyc3qgargei",
    "created": "2024-11-29 03:07:58.017Z",
    "updated": "2024-11-29 03:07:58.017Z",
    "name": "pantry",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "nbldjags",
        "name": "quantity",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("d0gzbyc3qgargei");

  return dao.deleteCollection(collection);
})
