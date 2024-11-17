/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d0gzbyc3qgargei")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "noxa9trx",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d0gzbyc3qgargei")

  // remove
  collection.schema.removeField("noxa9trx")

  return dao.saveCollection(collection)
})
