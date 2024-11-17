/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d0gzbyc3qgargei")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lrlbwflq",
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
    "id": "zytsccbj",
    "name": "expiry_date",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d0gzbyc3qgargei")

  // remove
  collection.schema.removeField("lrlbwflq")

  // remove
  collection.schema.removeField("zytsccbj")

  return dao.saveCollection(collection)
})
