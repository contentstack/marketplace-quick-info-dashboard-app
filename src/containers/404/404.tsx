import localeTexts from "../../common/locales/en-us/index";

const PageNotFound = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="app-component-content">
          <h3>{localeTexts[404].title}</h3>
          <p dangerouslySetInnerHTML={{ __html: localeTexts[404].body }} />
          <a target="_blank" rel="noreferrer" href={localeTexts[404].button.url}>
            {localeTexts[404].button.text}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
