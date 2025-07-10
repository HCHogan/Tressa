{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
        };
        name = "Tressa";
        src = ./.;

        node = pkgs.nodePackages.nodejs;
        pnpm = pkgs.pnpm;
        typescript = pkgs.nodePackages.typescript;

        eslint = pkgs.nodePackages.eslint;
        tailwind = pkgs.nodePackages."tailwindcss";

        commonPkgs = [node typescript tailwind eslint pnpm];
      in {
        packages.default = pkgs.stdenv.mkDerivation {
          inherit system name src;

          nativeBuildInputs = commonPkgs;

          buildPhase = ''
            export HOME=$PWD/.home
            npm ci --no-audit --no-fund --loglevel warn
            npm run build
          '';

          installPhase = ''
            mkdir -p $out
            cp -r dist/* $out/
          '';
        };
        devShells.default = pkgs.mkShell {
          packages = commonPkgs ++ [pkgs.nodePackages.postcss];

          shellHook = ''
            export NODE_ENV=development
          '';
        };
      }
    );
}
