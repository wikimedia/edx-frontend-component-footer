import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform/config';
import { AppContext } from '@edx/frontend-platform/react';

import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
], 'Footer component');

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

class SiteFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
  }

  externalLinkClickHandler(event) {
    const label = event.currentTarget.getAttribute('href');
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: 'outbound_link',
      label,
    };
    sendTrackEvent(eventName, properties);
  }

  render() {
    const {
      supportedLanguages,
      onLanguageSelected,
      logo,
      intl,
    } = this.props;
    const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
    const { config } = this.context;

    return (
      <div className="wrapper wrapper-footer">
        <footer id="footer-openedx" className="footer">
            <div className="footer-container">
                <nav className="nav-colophon" aria-label="${_('About')}">
                    <ol>
                    <li className="nav-colophon">
                        <a href="https://wikimediafoundation.org/privacy-policy/" target="_blank">Privacy Policy</a>
                    </li>
                    <li className="nav-colophon">
                        <a href="https://edly.io/euserpp/" target="_blank">"Edly Privacy Policy"</a>
                    </li>
                    </ol>
                </nav>

                <div className="wrapper-logo">
                    <p>
                      <a href={config.LMS_BASE_URL}>
                          <img 
                            src={logo || config.LOGO_TRADEMARK_URL} 
                            alt={intl.formatMessage(messages['footer.logo.altText'])}
                          />
                      </a>
                    </p>
                </div>
                <div className="flex-grow-1" />
                {showLanguageSelector && (
                  <LanguageSelector
                    options={supportedLanguages}
                    onSubmit={onLanguageSelected}
                  />
                )}
            </div>
        </footer>
    </div>
    );
  }
}

SiteFooter.contextType = AppContext;

SiteFooter.propTypes = {
  intl: intlShape.isRequired,
  logo: PropTypes.string,
  onLanguageSelected: PropTypes.func,
  supportedLanguages: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

SiteFooter.defaultProps = {
  logo: undefined,
  onLanguageSelected: undefined,
  supportedLanguages: [],
};

export default injectIntl(SiteFooter);
export { EVENT_NAMES };
