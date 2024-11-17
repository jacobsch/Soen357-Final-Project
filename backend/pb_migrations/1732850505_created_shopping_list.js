/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "slgp2515lnc2lyt",
    "created": "2024-11-29 03:21:45.975Z",
    "updated": "2024-11-29 03:21:45.975Z",
    "name": "shopping_list",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "3g2d5ocw",
        "name": "item",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "d0gzbyc3qgargei",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
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
  const collection = dao.findCollectionByNameOrId("slgp2515lnc2lyt");

  return dao.deleteCollection(collection);
})
