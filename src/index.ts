import { Players, RunService, Workspace } from "@rbxts/services";

export function CreateCustomWater(): RBXScriptConnection {
  const player = Players.LocalPlayer;
  const character = player.Character ?? player.CharacterAdded.Wait()[0];
  const humanoid = character.WaitForChild("Humanoid") as Humanoid;
  const rootPart = character.WaitForChild("HumanoidRootPart") as Part;

  let swimVelocity: BodyVelocity | undefined;

  // Get all water parts from the WaterParts folder
  const waterPartsFolder = Workspace.WaitForChild("WaterParts") as Folder;
  const waterParts: BasePart[] = [];

  // Function to collect all BaseParts from the folder
  function collectWaterParts() {
    waterParts.clear();
    for (const child of waterPartsFolder.GetChildren()) {
      if (child.IsA("BasePart")) {
        waterParts.push(child);
      }
    }
  }

  // Initial collection of water parts
  collectWaterParts();

  // Listen for changes in the folder
  waterPartsFolder.ChildAdded.Connect(() => collectWaterParts());
  waterPartsFolder.ChildRemoved.Connect(() => collectWaterParts());

  // Function to check if a position is inside any water part
  function isPositionInWater(position: Vector3): boolean {
    for (const waterPart of waterParts) {
      const partPosition = waterPart.Position;
      const partSize = waterPart.Size;

      const minBounds = partPosition.sub(partSize.div(2));
      const maxBounds = partPosition.add(partSize.div(2));

      if (
        position.X >= minBounds.X &&
        position.X <= maxBounds.X &&
        position.Y >= minBounds.Y &&
        position.Y <= maxBounds.Y &&
        position.Z >= minBounds.Z &&
        position.Z <= maxBounds.Z
      ) {
        return true;
      }
    }
    return false;
  }

  // Function to get the highest water level at a given X,Z position
  function getWaterLevelAt(x: number, z: number): number {
    let highestWaterLevel = -math.huge;

    for (const waterPart of waterParts) {
      const partPosition = waterPart.Position;
      const partSize = waterPart.Size;

      const minX = partPosition.X - partSize.X / 2;
      const maxX = partPosition.X + partSize.X / 2;
      const minZ = partPosition.Z - partSize.Z / 2;
      const maxZ = partPosition.Z + partSize.Z / 2;

      // Check if the X,Z position is within this water part's bounds
      if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
        const waterLevel = partPosition.Y + partSize.Y / 2;
        highestWaterLevel = math.max(highestWaterLevel, waterLevel);
      }
    }

    return highestWaterLevel;
  }

  // Underwater camera effect
  const camera = Workspace.CurrentCamera as Camera;
  const lighting = game.GetService("Lighting");

  const underwaterEffect = new Instance("ColorCorrectionEffect");
  underwaterEffect.TintColor = Color3.fromRGB(48, 183, 210);
  underwaterEffect.Saturation = -0.25;
  underwaterEffect.Contrast = -0.1;
  underwaterEffect.Enabled = false;
  underwaterEffect.Parent = lighting;

  const defaultFogColor = lighting.FogColor;
  const defaultFogEnd = lighting.FogEnd;
  const defaultFogStart = lighting.FogStart;
  const defaultAmbient = lighting.Ambient;
  const defaultOutdoorAmbient = lighting.OutdoorAmbient;
  const defaultColorShift_Top = lighting.ColorShift_Top;

  const underwaterFogColor = Color3.fromRGB(13, 107, 125);
  const underwaterAmbient = Color3.fromRGB(31, 156, 179);
  const underwaterColorShift = Color3.fromRGB(48, 183, 210);

  // Return the connection so it can be disconnected if needed
  return RunService.Heartbeat.Connect(() => {
    const rootPosition = rootPart.Position;
    const waterLevelAtPosition = getWaterLevelAt(rootPosition.X, rootPosition.Z);
    const isSubmerged = isPositionInWater(rootPosition.sub(new Vector3(0, rootPart.Size.Y / 2, 0)));

    if (isSubmerged) {
      if (!swimVelocity) {
        swimVelocity = new Instance("BodyVelocity");
        swimVelocity.Parent = rootPart;
      }
      swimVelocity.Velocity = humanoid.MoveDirection.mul(humanoid.WalkSpeed).add(new Vector3(0, 4, 0));
      if (humanoid.GetState() !== Enum.HumanoidStateType.Swimming) {
        humanoid.SetStateEnabled(Enum.HumanoidStateType.GettingUp, false);
        humanoid.ChangeState(Enum.HumanoidStateType.Swimming);
      }
    } else if (swimVelocity) {
      // This condition handles being near the surface but still in water
      if (rootPosition.Y < waterLevelAtPosition) {
        swimVelocity.Velocity = humanoid.MoveDirection.mul(humanoid.WalkSpeed);
      } else {
        swimVelocity.Destroy();
        swimVelocity = undefined;
        humanoid.SetStateEnabled(Enum.HumanoidStateType.GettingUp, true);
      }
    }

    const cameraPosition = camera.CFrame.Position;
    const cameraWaterLevel = getWaterLevelAt(cameraPosition.X, cameraPosition.Z);
    const isCameraUnderwater = cameraPosition.Y <= cameraWaterLevel && cameraWaterLevel > -math.huge;

    if (isCameraUnderwater) {
      underwaterEffect.Enabled = true;
      lighting.FogColor = underwaterFogColor;
      lighting.FogEnd = 150;
      lighting.FogStart = 0;
      lighting.Ambient = underwaterAmbient;
      lighting.OutdoorAmbient = underwaterAmbient;
      lighting.ColorShift_Top = underwaterColorShift;
    } else {
      underwaterEffect.Enabled = false;
      lighting.FogColor = defaultFogColor;
      lighting.FogEnd = defaultFogEnd;
      lighting.FogStart = defaultFogStart;
      lighting.Ambient = defaultAmbient;
      lighting.OutdoorAmbient = defaultOutdoorAmbient;
      lighting.ColorShift_Top = defaultColorShift_Top;
    }
  });
}
