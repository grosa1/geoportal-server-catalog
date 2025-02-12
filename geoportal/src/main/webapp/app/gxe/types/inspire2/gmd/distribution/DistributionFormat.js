define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/has",
        "../../base/Descriptor",
        "esri/dijit/metadata/form/Element",
        "esri/dijit/metadata/form/iso/AbstractObject",
        "esri/dijit/metadata/form/iso/GcoElement",
        "esri/dijit/metadata/form/iso/ObjectReference",
        "./formatDistributor",
        "dojo/text!./templates/distributionFormat.html"],
function(declare, lang, has, Descriptor, Element, AbstractObject, GcoElement, ObjectReference, FormatDistributor, template) {

  var oThisClass = declare(Descriptor, {

    templateString : template

  });

  return oThisClass;
});