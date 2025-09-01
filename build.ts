import solidPlugin from "./node_modules/@opentui/solid/scripts/solid-plugin";

const args = new Map(
  Bun.argv.slice(2).map(a => a.split("=") as [string, string])
);
const target = args.get("target") || "bun-darwin-arm64";
const outdir = args.get("outdir") || "./dist";
const outfile = args.get("outfile") || "awss";

const version = process.env.GITHUB_REF_NAME || "dev";

await Bun.build({
  entrypoints: ["./src/index.tsx"],
  target: "bun",
  outdir,
  plugins: [solidPlugin],
  minify: true,
  define: {
    "process.env.APP_VERSION": `"${version}"`,
  },
  compile: {
    target,
    outfile,
  },
});
