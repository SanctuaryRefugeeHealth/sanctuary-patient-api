import resource from "resource-router-middleware";
import templates from "../models/templates";

export default ({ config, db }) =>
  resource({
    /** Property name to store preloaded entity on `request`. */
    id: "template",

    /** GET / - List all entities */
    index({ params }, res) {
      res.json(templates);
    }
  });
