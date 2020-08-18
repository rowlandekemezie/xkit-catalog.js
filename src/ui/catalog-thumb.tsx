import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Card,
  Heading,
  Button,
  Paragraph,
  Pane,
  Badge,
  majorScale
} from 'evergreen-ui'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import { Link } from 'react-router-dom'
import ConnectorMark from './connector-mark'
import { ThemeConsumer, withTheme } from './theme'

interface CatalogThumbProps {
  connector: Connector
}

class CatalogThumb extends React.Component<ThemeConsumer<CatalogThumbProps>> {
  renderStatus () {
    const { connection } = this.props.connector

    if (!connection) return

    return <Badge color="green">Installed</Badge>
  }

  render () {
    const {
      connector: {
        name,
        slug,
        short_description,
        mark_url
      },
      theme
    } = this.props

    return (
      <Card
        backgroundColor={theme.palette.base}
        elevation={1}
        hoverElevation={3}
        marginRight={majorScale(3)}
        marginBottom={majorScale(3)}
        width={250}
        height={150}
        display="flex"
        flexDirection="column"
        padding={majorScale(2)}
        is={Link}
        textDecoration="none"
        to={`/connectors/${slug}`}
      >
        <Pane display="flex">
          <Pane flexGrow={1}>
            <ConnectorMark markUrl={mark_url} size={majorScale(5)} />
          </Pane>
          {this.renderStatus()}
        </Pane>
        <Heading size={600} marginTop={majorScale(1)}>{name}</Heading>
        <Paragraph size={300} marginTop="default">
          {short_description}
        </Paragraph>
      </Card>
    )
  }
}

export default withTheme(CatalogThumb)