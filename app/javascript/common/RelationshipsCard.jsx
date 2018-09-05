import PropTypes from 'prop-types'
import React from 'react'
import {SHOW_MODE} from 'actions/screeningPageActions'
import {EmptyRelationships} from 'common/Relationships'
import RelationshipsScreeningContainer from 'screenings/RelationshipsContainer'
import RelationshipsSnapshotContainer from 'containers/snapshot/RelationshipsContainer'
import CardView from 'views/CardView'

const getRelationshipsContainer = (isScreening) => (
  isScreening ? <RelationshipsScreeningContainer /> : <RelationshipsSnapshotContainer />
)

const RelationshipsCard = ({areRelationshipsEmpty, isScreening}) => (
  <CardView
    id='relationships-card'
    title='Relationships'
    mode={SHOW_MODE}
    show={areRelationshipsEmpty ? <EmptyRelationships /> : getRelationshipsContainer(isScreening)}
  />
)

RelationshipsCard.propTypes = {
  areRelationshipsEmpty: PropTypes.bool,
  isScreening: PropTypes.bool,
}

export default RelationshipsCard
