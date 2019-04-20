<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-3">
      <ul class="position-fixed">
        <strong>Item Fields</strong>
        <template v-for="field in fields">
          <li>
          <a class="link" :href="'#' + field.name">{{field.name}}</a>
          </li>
        </template>
      </ul>
    </div>
    <div class="col-12 col-md-9">  
      <h3>Item Fields</h3>
      <template v-for="field in fields">
        <span :id="field.name"></span>
        <h4 class="mt-5">{{field.name}}</h4>
        <p>{{field.helpText}}</p>
        <ul class="mb-5">
          <li><strong>Computer Name:</strong> {{field.computerName}}</li>
          <li><strong>Type:</strong> {{field.type}}</li>
        </ul>
        <hr />
      </template>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  export default {
    name: 'PublicSchema',
    data() {
      return {
        fields: {
          itemTitle: {
            name: 'Title',
            computerName: 'itemTitle',
            type: 'string',
            helpText: 'A name given to the resource.'
          },
          itemDescription: {
            name: 'Description',
            computerName: 'itemDescription',
            type: 'string',
            helpText: 'An account of the resource.'
          },
          tags: {
            name: 'Tags',
            computerName: 'tags',
            type: 'string',
            helpText: 'Sort items into sub-groups.'
          },
          itemMediaType: {
            name: 'Media Type',
            computerName: 'itemMediaType',
            type: 'string',
            helpText: 'The media used to represent this resource.'
          },
          itemMediaFileName: {
            name: 'File Name',
            computerName: 'itemMediaFileName',
            type: 'string',
            helpText: ''
          },
          itemMediaYoutubeId: {
            name: 'Youtube ID',
            computerName: 'itemMediaYoutubeId',
            type: 'string',
            helpText: ''
          },
          itemType: {
            name: 'Type',
            computerName: 'itemType',
            type: 'string',
            helpText: 'The nature or genre of the resource.'
          },
          itemContributor: {
            name: 'Contributor',
            computerName: 'itemContributor',
            type: 'string',
            helpText: 'An entity responsible for making contributions to the resource.'
          },
          itemDate: {
            name: 'Date',
            computerName: 'itemDate',
            type: 'string',
            helpText: 'A point or period of time associated with an event in the lifecycle of the resource.'
          },
          itemCoverage: {
            name: 'Coverage',
            computerName: 'itemCoverage',
            type: 'string',
            helpText: 'The spatial or temporal topic of the resource, the spatial applicability of the resource, or the jurisdiction under which the resource is relevant.'
          },
          itemCoverageLat: {
            name: 'Latitude',
            computerName: 'itemCoverageLat',
            type: 'string',
            helpText: 'Latitude.'
          },
          itemCoverageLong: {
            name: 'Longitude',
            computerName: 'itemCoverageLong',
            type: 'string',
            helpText: 'Longitude.'
          },
          itemCreator: {
            name: 'Creator',
            computerName: 'itemCreator',
            type: 'string',
            helpText: 'An entity primarily responsible for making the resource.'
          },        
          itemFormat: {
            name: 'Format',
            computerName: 'itemFormat',
            type: 'string',
            helpText: 'The file format, physical medium, or dimensions of the resource.'
          },   
          itemIdentifier: {
            name: 'Identifier',
            computerName: 'itemIdentifier',
            type: 'string',
            helpText: 'An unambiguous reference to the resource within a given context.'
          },   
          itemLanguage: {
            name: 'Language',
            computerName: 'itemLanguage',
            type: 'string',
            helpText: 'A language of the resource.'
          },   
          itemPublisher: {
            name: 'Publisher',
            computerName: 'itemPublisher',
            type: 'string',
            helpText: 'An entity responsible for making the resource available.'
          },   
          itemRelation: {
            name: 'Relation',
            computerName: 'itemRelation',
            type: 'string',
            helpText: 'A related resource.'
          },   
          itemRights: {
            name: 'Rights',
            computerName: 'itemRights',
            type: 'string',
            helpText: 'Information about rights held in and over the resource.'
          },   
          itemSource: {
            name: 'Source',
            computerName: 'itemSource',
            type: 'string',
            helpText: 'A related resource from which the described resource is derived.'
          },   
          itemSubject: {
            name: 'Subject',
            computerName: 'itemSubject',
            type: 'string',
            helpText: 'The topic of the resource.'
          }                                                                                                                                                                                      
        }
      }
    },
    methods: {
    }
  }
</script>
