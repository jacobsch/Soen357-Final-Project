/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("slgp2515lnc2lyt")

  // remove
  collection.schema.removeField("3g2d5ocw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yk6kr5jn",
    "name": "name",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tkpknowo",
    "name": "purchased",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wjj3nx3x",
    "name": "image",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "083cbahb",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("slgp2515lnc2lyt")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // remove
  collection.schema.removeField("yk6kr5jn")

  // remove
  collection.schema.removeField("tkpknowo")

  // remove
  collection.schema.removeField("wjj3nx3x")

  // remove
  collection.schema.removeField("083cbahb")

  return dao.saveCollection(collection)
})
