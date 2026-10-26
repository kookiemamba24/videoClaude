import { Composition, Folder } from "remotion";
import { ClientResult, clientResultSchema } from "./ClientResult/ClientResult";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />
      <Composition
        id="ClientResult"
        component={ClientResult}
        schema={clientResultSchema}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          name: "William",
          role: "Marketing agency",
          before: [
            "Inconsistent lead flow",
            "Leads not consistently qualified",
            "No follow-up sequence or automations",
          ],
          tookOver: ["The offer", "Ads", "Funnel", "Follow-up"],
          stat: 34,
          statSuffix: "K",
          statCaption: "a month, with more than $80K in profit",
          days: 86,
        }}
      />
    </>
  );
};
